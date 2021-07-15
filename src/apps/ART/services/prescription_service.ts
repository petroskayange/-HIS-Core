import { DrugInterface } from "@/interfaces/Drug";
import { DrugOrderService } from "@/services/drug_order_service";
import { Observation } from "@/services/observation_service";
import HisDate from "@/utils/Date"
import { RegimenService } from "@/services/regimen_service";
import { find, isEmpty } from "lodash"
import { AppEncounterService } from "@/services/app_encounter_service"
export const REGIMEN_SWITCH_REASONS = [
    'Policy change', 'Ease of administration (pill burden, swallowing)',
    'Drug drug interaction', 'Pregnancy intention',
    'Side effects', 'Treatment failure', 'Weight Change', 'Other'
]

export enum HangingPill {
   OPTIMIZE = 'Optimize - including hanging pills',
   EXACT = 'Exact - excluding hanging pills'
}

export class PrescriptionService extends AppEncounterService {
    nextVisitInterval: number;
    prescribeArvs: boolean;
    fastTrack: boolean;
    useHangingPills: boolean;
    received3HP: boolean;
    regimenExtras: Array<Record<string, any>>;
    hangingPills: Array<Record<string, any>>;
    fastTrackMedications: Array<Record<string, any>>;
    constructor(patientID: number) {
        super(patientID, 25) //TODO: Use encounter type reference name
        this.nextVisitInterval = 0
        this.prescribeArvs = false
        this.fastTrack = false
        this.received3HP = false
        this.useHangingPills = false
        this.regimenExtras = []
        this.fastTrackMedications = []
        this.hangingPills = []
    }

    setNextVisitInterval(nextVisitInterval: number) {
        this.nextVisitInterval = nextVisitInterval
    }

    getPatientRegimens() { return RegimenService.getRegimens(this.patientID) }

    getCustomIngridients() { return RegimenService.getCustomIngridients() }

    getFastTrackMedications() { return this.fastTrackMedications }

    isFastTrack() { return this.fastTrack }
    
    shouldPrescribeArvs() { return this.prescribeArvs }

    hasHangingPills(drugs: any) {
        let isHanging = false
        for(const index in drugs) {
            const drug = drugs[index]
            const filter = find(this.hangingPills, {
                drug: drug.drug_id, hasRemaining: true
            })
            if (filter) {
                isHanging = true
                break;
            }
        }
        return isHanging
    }


    async load3HpStatus() {
        const orders = await AppEncounterService.getAll(this.patientID, 'Medication orders')
      
        if (!orders) return

        const rifapentine = await AppEncounterService.getConceptID('Rifapentine')

        const ordered = find(orders, {'value_coded': rifapentine})

        if (ordered) this.received3HP = true
    }

    async loadFastTrackStatus() {
        const isFastTrack = await AppEncounterService.getFirstValueCoded(this.patientID, 'Fast track')
        const yes = await AppEncounterService.getConceptID('yes')

        if (isFastTrack) this.fastTrack = isFastTrack === yes
    }
    
    async loadRegimenExtras(date=RegimenService.getSessionDate()) {
        const meds = await RegimenService.getJson(
            `programs/${RegimenService.getProgramID()}/patients/${this.patientID}/dosages`,
            {date}
        )
        if (meds) this.regimenExtras = Object.values(meds)
    }

    async loadArvPrescriptionStatus() {
        const data = await AppEncounterService.buildValueCoded("Medication orders", "Antiretroviral drugs")
        const status = await AppEncounterService.getObs(data)

        if (!isEmpty(status)) this.prescribeArvs = true
    }

    async loadHangingPills() {
        const pills = await AppEncounterService.getAll(this.patientID, 'Pills brought')

        if (pills) this.hangingPills = pills.map((item: any)=> {
            try {
                return {
                    drug: item.order.drug_order.drug_inventory_id,
                    hasRemaining: item.value_numeric >= 1
                }
            }catch(e) {
                return { drug: 0, hasRemaining: false }
            }
        })
    }

    async loadFastTrackMedications() {
        const drugs = await DrugOrderService.getLastDrugsReceived(this.patientID)
        const withDosages = drugs.map(async(data: any) => {
            const { drug } = data
            const dosage = await DrugOrderService.getDrugDosages(this.patientID, drug.drug_id)
            return {
                'drug_id': drug.drug_id,
                'drug_name': drug.name,
                'units': drug.units,
                'am': dosage.am,
                'noon': dosage.noon,
                'pm': dosage.pm,
                'frequency': data.frequency
            }
        })
        this.fastTrackMedications = await Promise.all(withDosages)
    }

    getRegimenExtras() { return this.regimenExtras }

    calculatePillsPerDay(am: number, noon: number, pm: number) {
        return parseFloat(am.toString()) + noon + pm
    }

    estimatePackSize(pillsPerDay: number, packSize=0) {
        const packs = (pillsPerDay * this.nextVisitInterval) / packSize
        
        let roundedPacks = Math.round(packs)

        if (roundedPacks <= 0) roundedPacks += 1

        return roundedPacks
    }

    calculateDosage(morningTabs: number, eveningTabs: number): number {
        let dose = 0
        if (eveningTabs === 0) dose = morningTabs

        if (morningTabs == 0) dose = eveningTabs

        if (morningTabs > 0 && eveningTabs  > 0) {
            dose = (morningTabs + eveningTabs) / 2
        }
        return dose
    }
    
    calculateEquivalentDosage(morningTabs: number, eveningTabs: number): number {
        return morningTabs + eveningTabs
    }

    calculateDateFromInterval() {
        const dateObj = new Date(RegimenService.getSessionDate())
        dateObj.setDate(dateObj.getDate() + this.nextVisitInterval)
        return HisDate.toStandardHisFormat(dateObj)
    }

    getDrugPackSize(drug: any) {
        if (drug.pack_size) return drug.pack_size
        try{
            return drug.barcodes[0].tabs
        }catch(e) {
            return 30
        }
    }

    getInstructions(drugName: string, morningTabs: number, eveningTabs: number, units: string): string {
        return `${drugName} :- Morning: ${morningTabs} ${units}, Evening: ${eveningTabs} ${units}`
    }

    getDrugFrequency(drugName: string): string {
        if (this.received3HP && drugName.match(/Rifapentine|Isoniazid/i)) {
            return 'Weekly (QW)'
        }
        return 'Daily (QOD)'
    }

    toOrderObj(id: number, name: string, units: string, am=0, pm=0, frequency=''): DrugInterface {
        return {
            'drug_inventory_id': id,
            'equivalent_daily_dose': this.calculateEquivalentDosage(am, pm),
            'start_date': RegimenService.getSessionDate(),
            'auto_expire_date': this.calculateDateFromInterval(), 
            'units': units,
            'instructions': this.getInstructions(name, am, pm, units),
            'dose': this.calculateDosage(am, pm),
            'frequency': frequency || this.getDrugFrequency(name)
        }
    }

    async getReasonForRegimenSwitch() {
        const reason = await AppEncounterService.getFirstValueText(this.patientID, 'Reason for ARV switch')
        return reason ? reason : 'N/A'
    }

    async createDrugOrder(drugOrders: Array<DrugInterface>) {
        return DrugOrderService.create({
            'encounter_id': this.encounterID,
            'drug_orders': drugOrders
        })
    }

    async createHangingPillsObs(response: HangingPill) {
        return this.saveValueTextObs('appointment type', response)
    }

    async createRegimenSwitchObs(reasonForSwitch: string): Promise<Observation> {
        return this.saveValueTextObs('Reason for ARV switch', reasonForSwitch)
    }
}
