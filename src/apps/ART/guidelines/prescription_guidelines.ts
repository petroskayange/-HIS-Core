/**
 * QUICK FACTS ABOUT ART REGIMENS (Malawi Clinical HIV Guidelines 2018 Version 1)
 *  - ART regimens are grouped into first and secondline
 *  - Each regimen is identified by a number. 
 *    [0, 2, 4, 5, 6, 8, 9, 10, 11, 13, 14]
 *  - Firstline regimens include [0, 2, 4, 5, 6, 13, 14]
 *  - Secondline regimens include [7, 8, 9, 10, 11]
 *  - Some regimens are "phased in" on initiation (Due to adverse reaction). As such, 
 *    a starter pack is provided for atleast two weeks. Regimens that require a
 *    starter pack include [0, 2, 6]
 */
import { GuideLineInterface } from "@/utils/GuidelineEngine"
import { hisOptionsActionSheet, hisListActionSheet, hisDecisionActionSheet } from "@/utils/Alerts"

export const REGIMEN_SELECTION_GUIDELINES: Record<string, GuideLineInterface> = {
    "Do not prescribe LPV regimens together with 3HP": {
        priority: 1,
        actions: {
            alert: async ({ selectedRegimenName }: any) => {
                await hisDecisionActionSheet(
                    '3HP - LPV/r conflict',
                    selectedRegimenName,
                    `Regimens containing LPV/r cannot be prescribed together with 3HP`,
                    [
                       { name: 'Close', slot: 'end', color: 'danger' }
                    ],
                    'his-danger-color'
                )
                return 'exit'
            }
        },
        conditions: {
            selectedRegimenCode(code: number) {
                return [7, 8, 9, 10, 11, 12].includes(code)
            },
            medicationOrders(orders: Array<string>) {
                const threeHp = ['Rifapentine', 'INH']
                return orders.filter(i => threeHp.includes(i)).length >= 1
            }
        }
    },
    "Check for any adverse effects or contraindications associated with the regimen": {
        priority: 1,
        actions: {
            alert: async ({ selectedRegimenName, patientAdverseEffects }: any) => {
                const action = await hisDecisionActionSheet(
                    selectedRegimenName,
                    'Contraindications / Side effects',
                    patientAdverseEffects.join(','),
                    [
                        { name: 'Select other regimen', slot: 'start'},
                        { name: 'Keep selected regimen', slot: 'end', color: 'danger' }
                    ]
                )
                return action === 'select other regimen' ? 'exit' : 'continue'
            }
        },
        conditions: {
            selectedDrugContraIndications(
                effects: Array<string>, 
                { patientAdverseEffects }: any) {

                return patientAdverseEffects.filter((i: string) => effects.includes(i)).length >= 1
            }
        }
    },
    "Recommend 2nd line regimen to children under 3": {
        priority: 1,
        actions: {
            alert: async () => {
                const action = await hisListActionSheet(
                    'Recommendation',
                    '',
                    [
                        "Children under 3 years often have a high viral load and may be infected with drug-resistant HIV from previous exposure to ARVs (mother's ART and/or infant nevirapine prophylaxis)",
                        "Therefore, children under <b>3 years</b> respond better when <b>started immediately on 2nd line regimen</b> (Regimen <b>11</b>)",
                    ],
                    [
                        { name: 'Cancel', slot: 'start' }, 
                        { name: 'Keep selected regimen', slot: 'end', color: 'danger' }
                    ],
                    'his-warning-color'
                )
                return action === 'Cancel' ? 'exit' : 'continue'
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
                const modal = await hisOptionsActionSheet(
                    `Are you sure you want to replace ${facts.currentRegimenCode}?`,
                    'Specify reason for switching regimen',
                    [ 
                        'Policy change', 
                        'Ease of administration (pill burden, swallowing)',
                        'Drug drug interaction', 
                        'Pregnancy intention',
                        'Side effects', 
                        'Treatment failure', 
                        'Weight Change', 
                        'Other'
                    ],
                    [
                        { name: 'Cancel', slot:'start' },
                        { name: 'Continue', slot: 'end' }
                    ]
                )

                if (modal.action != 'Cancel') {
                    facts.reasonForSwitch = modal.selection
                    return 'continue'
                }
                return 'exit'
            }
        },
        conditions: {
            selectedRegimenCode(code: string, { currentRegimenCode }: any){
                return currentRegimenCode != -1 && code != currentRegimenCode
            }
        }
    },
    "Provide 14 day starter pack for LPV regimens for children under 3 years old": {
        priority: 3,
        actions: {
            alert: async (facts: any) => {
                const action = await hisDecisionActionSheet(
                    'Starter pack needed for 14 days',
                    `${ facts.treatmentInitiationState}`, 
                    `${ facts.selectedRegimenName }`,
                    [
                        { name: 'Cancel', slot: 'start', color: 'secondary'},
                        { name: 'Prescribe starter pack', slot: 'end' }
                    ],
                    'his-info-color'
                )

                if (action === 'Prescribe starter pack') {
                    facts.starterPackNeeded = true
                    return 'continue'
                }
                return 'exit'
            },
        },
        conditions: {
            age(age: number) {
                return age < 3
            },
            selectedRegimenCode(code: number) {
                return code === 11
            },
            treatmentInitiationState(state: string) {
                return ['Initiation', 'Re-initiation'].includes(state)
            }
        }
    },
    "Provide 14 day starter pack for NVP based regimens on newly initiated/re-initiation patients": {
        priority: 3,
        actions: {
            alert: async (facts: any) => {
                const action = await hisDecisionActionSheet(
                    'Starter pack needed for 14 days',
                    `${ facts.treatmentInitiationState}`, 
                    `${ facts.selectedRegimenName }`,
                    [
                        { name: 'Cancel', slot: 'start', color: 'secondary'},
                        { name: 'Prescribe starter pack', slot: 'end' }
                    ],
                    'his-info-color'
                )

                if (action === 'Prescribe starter pack') {
                    facts.starterPackNeeded = true
                    return 'continue'
                }
                return 'exit'
            },
        },
        conditions: {
            selectedRegimenCode(code: number) {
                return [0, 2, 6].includes(code)
            },
            treatmentInitiationState(state: string) {
                return ['Initiation', 'Re-initiation'].includes(state)
            }
        }
    },
    "Ask to reuse hanging pills if any": {
        priority: 5,
        actions: {
            alert: async (facts: any) => {
                const action  = await hisDecisionActionSheet(
                    facts.selectedRegimenName,
                    'Hanging Pills', 
                    'Do you want to use hanging pills?',
                    [
                        { name: 'No', slot: 'start', color: 'secondary'},
                        { name: 'Yes', slot: 'end'}
                    ],
                    'his-info-color'
                )
                if (action === 'Yes') {
                    facts.hangingPillsStatus = 'Optimize - including hanging pills'
                } else {
                    facts.hangingPillsStatus = 'Exact - excluding hanging pills'
                }
                return 'continue'
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
            alert: async ({selectedRegimenName}: any) => {
                const action = await hisDecisionActionSheet(
                    `Use of DTG or EFV in women of reproductive age`,
                    selectedRegimenName,
                    [
                        'There is currently <u>no confirmation</u>',
                        'that <b>DTG</b> is safe in <u>very early preganancy</u>',
                        'DTG-based regimens are therefore not used as standard 1st line regimens for',
                        '<u>girls and women</u> who may get preganant'
                    ].join(' '),
                    [
                        { name: 'Select another regimen', slot: 'start' }, 
                        { name: 'Continue with regimen', slot: 'end', color: 'danger'}
                    ],
                    'his-danger-color'
                )
                return action === 'Select another regimen' ? 'exit': 'continue'
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
                const action = await hisDecisionActionSheet(
                    'Select unit', 
                    'Prescribe LPV/r in Pellets (cups) or Tablets?',
                    '',
                    [
                        { name: 'Granules', slot: 'start' },
                        { name: 'Pellets', slot: 'start' },
                        { name: 'Tabs', slot:'end' }
                    ],
                    'his-info-color'
                )
                facts.lpvType = action
                return 'continue'
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
    'Use 14 day Starterpack for NVP or LVP regimen(s)': {
        priority: 1,
        actions: {
            enabled: true
        },
        conditions: {
            selectedInterval(interval: number) {
                return interval === 14
            },
            starterPackNeeded(isNeeded: boolean) {
                return isNeeded
            },
            selectedRegimenCode(code: number) {
                return [0, 2, 6, 11].includes(code)
            }
        }
    },
    "Disable none 14 day intervals Starter pack(s) for NVP or LVP regimens": {
        priority: 1,
        actions: {
            enabled: false
        },
        conditions: {
            selectedInterval(interval: number) {
                return interval > 14
            },
            starterPackNeeded(isNeeded: boolean) {
                return isNeeded
            },
            selectedRegimenCode(code: number) {
                return [0, 2, 6, 11].includes(code)
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
