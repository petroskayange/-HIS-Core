import { GuideLineInterface } from "@/utils/GuidelineEngine"
import { actionSheet } from "@/utils/Alerts"

export const REGIMEN_SELECTION_GUIDELINES: Record<string, GuideLineInterface> = {
    "Check for any adverse effects or contraindications associated with the regimen": {
        priority: 1,
        actions: {
            alert: async (facts: any) => {
                const action = await actionSheet(
                    'Contraindications / Side effects',
                    facts.selectedRegimenEffects.join(','),
                    ['Select other regimen', 'Keep selected regimen']
                )
                return action === 'Keep selected regimen'
            }            
        },
        conditions: {
            selectedRegimenEffects(effects: Array<string>) {
                return effects.length >= 1
            }
        }
    },
    "Recommend 2nd line regimen to children under 3": {
        priority: 1,
        actions: {
            alert: async () => {
                const action = await actionSheet(
                    'Secondline treatment recommendation',
                    [
                        "Children under 3 years often have a high viral load and may ",
                        "be infected with drug-resistant HIV from previous exposure ",
                        "to ARVs (mother's ART and/or infant nevirapine prophylaxis)",
                        "Therefore, children under 3 years respond better when ",
                        "started immediately on 2nd line regimen (Regimen 11)"
                    ].join(' '),
                    ['Cancel', 'Keep selected regimen']
                )
                return action === 'Keep selected regimen'
            }
        },
        conditions: {
            age(age: number) {
                return age < 3
            },
            selectedRegimenCode(code: number) {
                return code != 11
            }
        }
    }, 
    'Provide a reason for switching regimens when patient already has one': {
        priority: 1,
        actions : {
            alert: async (facts: any) => {
                const action = await actionSheet(
                    `Are you sure you want to replace ${facts.currentRegimen}?`,
                    'Specify reason for switching regimen',
                    [ 
                        'Policy change', 
                        'Ease of administration (pill burden, swallowing)',
                        'Drug drug interaction', 
                        'Pregnancy intention',
                        'Side effects', 
                        'Treatment failure', 
                        'Weight Change', 
                        'Other',
                        'Cancel'
                    ]
                )
                if (action != 'cancel') {
                    facts.reasonForSwitch = action
                    return true
                }
                return false
            }
        },
        conditions: {
            currentRegimen(regimen: string) {
                return regimen != 'N/A'
            },
            selectedRegimen(regimen: string, { currentRegimen }: any){
                return regimen != currentRegimen
            }
        }
    },
    "Provide 14 day starter pack for NVP based regimens on newly initiated patients": {
        priority: 3,
        actions: {
            alert: async (facts: any) => {
                const action = await actionSheet(
                    'First time initiation', 
                    'Starter pack needed for 14 days',
                    ['Prescribe starter pack', 'Cancel']
                )

                if (action === 'Prescribe starter pack') {
                    facts.starterPack = true
                    facts.currentField = 'selected_meds'
                    return true
                }
                return false
            },
        },
        conditions: {
            selectedRegimen(regimen: string) {
                return regimen.match(/NVP/i) ? true : false
            },
            treatmentInitiation(initiation: string) {
                return initiation === 'Continuing'
            }
        }
    },
    "Ask to reuse hanging pills if any": {
        priority: 5,
        actions: {
            alert: async (facts: any) => {
                const action  = await actionSheet(
                    'Do you want to use hanging pills?', '', ['Yes', 'No']
                )
                if (action === 'Yes') {
                    facts.hangingPillsStatus = 'Optimize - including hanging pills'
                } else {
                    facts.hangingPillsStatus = 'Exact - excluding hanging pills'
                }
                return true
            }
        },
        conditions: {
           selectedDrugs(drugs: Array<string>, { hangingPills }: any){
                const hanging = drugs.map(drug => hangingPills.includes(drug))
                return hanging.some(Boolean)
           }
        }
    },
    "Provide warning of use of DTG regimen to women of reproductive age" : {
        priority: 2,
        actions: {
            alert: async () => {
                const action = await actionSheet(
                    'Use of DTG or EFV in women of reproductive age',
                    ['There is currently no confirmation',
                    'that DTG is safe in very early preganancy',
                    'DTG-based regimens are therefore not used as standard 1st line regimens for',
                    'girls and women who may get preganant'].join(' '),
                    ['Select another regimen', 'Continue with regimen']
                )
                return action === 'Continue with regimen'
            }
        },
        conditions: {
            selectedRegimenCode(code: number) {
                return code >= 12
            },
            gender(gender: string) {
                return gender === 'F'
            },
            age(age: number) {
                return age >= 14 && age <= 45
            }
        }
    },
    "Provide pallet options for LPV regimens for patient's whose weight is between 3 and 25 kgs" : {
        priority: 6,
        actions: {
            alert: async (facts: any) => {
                const action = await actionSheet(
                    'Prescribe LPV/r in Pellets (cups) or Tablets?', '',
                    ['Granules', 'Pellets', 'Tabs']
                )
                facts.lpvType = action
                return true
            }
        },
        conditions: {
            weight(weight: number){
                return weight >= 3 && weight <= 25
            },
            selectedRegimenCode(code: number){
                return code === 11 || code === 9
            }
        }
    }
}

export const INTERVAL_RECOMMENDATION: Record<string, GuideLineInterface> = {
    'Recommend 2 week interval for starterpack NVP regimens': {
        priority: 1,
        actions: {
            isChecked: true
        },
        conditions: {
            starterPack(selected: boolean) {
                return selected
            },
            selectedRegimen(regimen: string) {
                regimen.match(/NVP/i) ? true : false
            }
        }
    }
}

export const DRUG_FREQUENCY_GUIDELINE: Record<string, GuideLineInterface> = {
    'Rifapentine or isoniazid should be taken weekly': {
        concept: 'Weekly (QW)',
        priority: 1,
        conditions: {
            selectedDrug(drug: string) {
                return drug.match(/Rifapentine|Isoniazid/i)
            }
        }
    },
    'Use daily frequency for any other drugs': {
        concept: 'Daily (QOD)',
        priority: 2,
        conditions: {
            selectedDrug(drug: string) {
                return !drug.match(/Rifapentine|Isoniazid/i)
            }
        }
    }
}
