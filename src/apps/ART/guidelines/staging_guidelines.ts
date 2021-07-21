import { ConceptService } from "@/services/concept_service"
import { alertConfirmation } from "@/utils/Alerts"
import { GuideLineInterface } from "@/utils/GuidelineEngine"

export const ADULT_WHO_STAGE_CRITERIA: Record<string, GuideLineInterface> = {
    'Adults with stage 4 conditions': {
        concept: 'WHO STAGE IV ADULT',
        minPass: 100,
        priority: 1,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 4,
                pass: 100
            }
        }
    },
    'Classify as stage 4 when reason for ART is WHO STAGE 4': {
        concept: 'WHO STAGE IV ADULT',
        minPass: 100,
        priority: 2,
        conditions: {
            'reason_for_art': {
                condition: (reason: string) => reason === 'WHO STAGE IV ADULT',
                pass: 100
            }
        }
    },
    'Adults with stage 3 conditions': {
        concept: 'WHO STAGE III ADULT',
        minPass: 100,
        priority: 3,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 3,
                pass: 100
            }
        }
    },
    'Adults with stage 2 conditions': {
        concept: 'WHO STAGE II ADULT',
        minPass: 100,
        priority: 4,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 2,
                pass: 100
            }
        }
    },
    'Adults with stage 1 conditions': {
        concept: 'WHO STAGE I ADULT',
        minPass: 100,
        priority: 5,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 1,
                pass: 100
            }
        }
    }
}

export const CHILD_WHO_STAGE_CRITERIA: Record<string, GuideLineInterface> = {
    'Children with stage 4 conditions': {
        concept: 'WHO STAGE IV PEDS',
        minPass: 100,
        priority: 1,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 4,
                pass: 100
            }
        }
    },
    'Classify as stage 4 when reason for ART is WHO STAGE 4': {
        concept: 'WHO STAGE IV PEDS',
        minPass: 100,
        priority: 2,
        conditions: {
            'reason_for_art': {
                condition: (reason: string) => reason === 'WHO STAGE IV PEDS',
                pass: 100
            }
        }
    },
    'For children with stage 3 conditions': {
        concept: 'WHO STAGE III PEDS',
        minPass: 100,
        priority: 3,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 3,
                pass: 100
            }
        }
    },
    'Children with stage 2 conditions': {
        concept: 'WHO STAGE II PEDS',
        minPass: 100,
        priority: 4,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 2,
                pass: 100
            }
        }
    },
    'Children with stage 1 conditions': {
        concept: 'WHO STAGE I PEDS',
        minPass: 100,
        priority: 5,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 1,
                pass: 100
            }
        }
    }
}

export const CONTRADICTING_STAGE_DEFINITIONS_ALERTS: Record<string, GuideLineInterface> = {
    "Warn if Severe weight loss is selected when actual patient BMI is acceptable": {
        concept: 'Severe weight loss >10% and/or BMI <18.5kg/m^2, unexplained',
        minPass: 100,
        priority: 1,
        actions: {
            alert: () => {
                return alertConfirmation(
                    'Patient has a normal BMI, do you want to continue?'
                )
            },
        },
        conditions: {
            'selected_condition': {
                condition: (condition: string) => condition === 'Severe weight loss >10% and/or BMI <18.5kg/m^2, unexplained',
                pass: 50
            },
            bmi: {
                condition: (bmi: number) => bmi > 18.0,
                pass: 50 
            }
        }
    },
    "Warn for contradicting stage defining conditions": {
        concept: 'Asymptomatic HIV infection',
        minPass: 100,
        priority: 1,
        actions: {
            alert: () => {
                return alertConfirmation(
                    'CONTRADICTING STAGE DEFINING CONDITIONS'
                )
            }
        },
        conditions: {
            'selected_condition': {
                condition: (condition: string) => condition === 'Asymptomatic HIV infection',
                pass: 50
            },
            stage: {
                condition: (stage: number) => stage >= 2,
                pass: 50 
            }
        }
    },
}

export const RECOMMENDED_ADULT_STAGING_CONDITIONS: Record<string, GuideLineInterface> = {
    'Adults with a BMI less than 16': {
        concept: 'Severe weight loss >10% and/or BMI <18.5kg/m^2, unexplained',
        minPass: 100,
        priority: 1,
        actions: {
            isChecked: true
        },
        description: {
            color: 'danger',
            show: 'always',
            info: (facts: any) => `Adult has a low BMI of ${facts.bmi}`
        },
        conditions: {
            bmi: {
                condition: (bmi: number) => bmi < 16,
                pass: 100
            }
        }
    },
    'Adults whose BMI is between 16 and 18': {
        concept: 'Moderate weight loss less than or equal to 10 percent, unexplained',
        minPass: 100,
        priority: 1,
        actions: {
            isChecked: true
        },
        description: {
            color: 'warning',
            show: 'onChecked',
            info: (facts: any) => `BMI of ${facts.bmi} is between 16 and 18`,
        },
        conditions: {
            bmi:{
                condition: (bmi: number) => bmi >= 16.0 && bmi <= 18.5,
                pass: 50 
            }
        }
    },
    "Disable Moderate weight loss if severe weightloss is selected": {
        concept: 'Moderate weight loss less than or equal to 10 percent, unexplained',
        minPass: 100,
        priority: 1,
        actions: {
            isChecked: false,
            disabled: true
        },
        description: {
            color: 'secondary',
            show: 'always',
            info: () => 'Severe weight loss was already selected',
        },
        conditions: {
            'selected_conditions': {
                condition: (conditions: Array<string>) => conditions.includes('Severe weight loss >10% and/or BMI <18.5kg/m^2, unexplained'),
                pass: 100
            }
        }
    }
}

export const CHILD_ART_ELIGIBILITY: Record<string, GuideLineInterface> = {
    'Has stage 4 conditions': {
        concept: 'WHO STAGE IV PEDS',
        minPass: 100,
        priority: 1,
        conditions: {
            stage: {
                condition: () => (stage: number) => stage === 4,
                pass: 100
            }
        }
    },
    'Has stage 3 conditions': {
        concept: 'WHO STAGE III PEDS',
        minPass: 100,
        priority: 2,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 3,
                pass: 100
            },
        }
    },
    'Children under twelve months who tested positive on Rapid test and have presumed severe HIV': {
        concept: 'PRESUMED SEVERE HIV',
        minPass: 100,
        priority: 3,
        conditions: {
            'age_in_months':  {
                condition: (age: number) => age < 12,
                pass: 25
            },
            'selected_conditions': {
                condition: (conditions: Array<string>) => {
                    const pshdConditions = ConceptService.getConceptsByCategory('pshd_condition')
                    for(const pshdCondition in pshdConditions) {
                        if (conditions.includes(pshdCondition)) return true
                    }
                    return false
                },
                pass: 25
            },
            'test_type': {
                condition: (testType: string) => testType === 'HIV rapid test',
                pass: 50
            }
        }
    },
    "Children under twelve who tested positive via HIV DNA Polymerase Chain Reaction test": {
        concept: 'HIV DNA POLYMERASE CHAIN REACTION',
        minPass: 100,
        priority: 4,
        conditions: {
            'age_in_months': {
                condition: (age: number) => age < 12,
                pass: 50
            },
            'test_type': {
                condition: (testType: string) => testType === "HIV DNA POLYMERASE CHAIN REACTION",
                pass: 50
            }
        }
    },
    "Children who are less than 24 months": {
        concept: 'HIV infected',
        minPass: 100,
        priority: 5,
        conditions: {
            age: {
                condition: (age: number) => age < 24,
                pass: 100
            }
        }
    },
    "Children between 24 and 56 months who have stage 2 or 1 conditions": {
        concept: 'CD4 COUNT LESS THAN OR EQUAL TO 750',
        minPass: 100,
        priority: 6,
        conditions: {
            'age_in_months': {
                condition: (age: number) => age >= 24 && age <= 56,
                pass: 25
            },
            cd4: {
                condition: (cd4: number) => cd4 <= 750,
                pass: 25
            },
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 50
            }
        }
    },
    "Children with CD4 count less than 500 and have stage 1 and stage 2 conditions": {
        concept: 'CD4 COUNT LESS THAN OR EQUAL TO 500',
        minPass: 100,
        priority: 7,
        conditions: {
            cd4: {
                condition: (cd4: number) => cd4 < 500,
                pass: 50
            },
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 50
            }
        }
    },
    "Children over the date 2014-04-01 who are more than five years old and have cd4 count less than 500": {
        concept: 'CD4 COUNT LESS THAN OR EQUAL TO 500',
        minPass: 100,
        priority: 9,
        conditions: {
           date: {
               condition: (date: string) => date >= '2014-04-01',
               pass: 50
           },
           age: {
               condition: (age: number) => age > 5,
               pass: 50
           }
        }
    },
    "Children over date 2014-04-01 and less than Five years old": {
        concept: 'HIV infected',
        minPass: 100,
        priority: 10,
        conditions: {
            date: {
                condition: (date: string) => date >= '2014-04-01',
                pass: 50
            },
            age: {
                condition: (age: number) => age <= 5,
                pass: 50
            }
        }
    },
    "Asymptomatic patient with either stage one or stage two conditions": {
        concept: 'Asymptomatic',
        minPass: 100,
        priority: 11,
        conditions: {
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 100
            } 
        }
    }
}

export const ADULT_ART_ELIGIBILITY: Record<string, GuideLineInterface> = {
    'Has stage 4 conditions': {
        concept: 'WHO STAGE IV ADULT',
        minPass: 100,
        priority: 1,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 4,
                pass: 100
            }
        }
    },
    'Has HIV wasting syndrome identified in stage 3': {
        concept: 'WHO STAGE IV ADULT',
        minPass: 100,
        priority: 2,
        conditions: {
            'selected_conditions': {
                condition: (conditions: Array<string>) => {
                    const severeSymp = ConceptService.getConceptsByCategory('severe_hiv_wasting_syndrome')
                    const found = severeSymp.reduce((total, symp) => conditions.includes(symp.name) ? total+1: 0, 0)
                    return found >= 2
                },
                pass: 100
            }
        }
    },
    'Has stage 3 conditions': {
        concept: 'WHO STAGE III ADULT',
        minPass: 100,
        priority: 3,
        conditions: {
            stage: {
                condition: (stage: number) => stage === 3,
                pass: 100
            }
        }
    },
    'CD4 less than 350 for adults before 2014': {
        concept: 'cd4 less than or equal to 350',
        minPass: 100,
        priority: 4,
        conditions: {
            date: {
                condition: (date: string) => date < '2014-04-01',
                pass: 50
            },
            cd4: {
                condition: (cd4: number) => cd4 <= 350,
                pass: 25
            },
            'cd4_modifier': {
                condition: (modifier: string) => modifier === '<',
                pass: 25
            }
        }
    },
    'CD4 less than 250 for adults after 2014': {
        concept: 'cd4 less than or equal to 250',
        minPass: 100,
        priority: 4,
        conditions: {
            date: {
                condition: (date: string) => date >= '2014-04-01',
                pass: 50
            },
            cd4: {
                condition: (cd4: number) => cd4 <= 250,
                pass: 25
            },
            'cd4_modifier': {
                condition: (modifier: string) => modifier === '<',
                pass: 25
            }
        }
    },
    'CD4 less than 350 for adults after 2014': {
        concept: 'cd4 less than or equal to 350',
        minPass: 100,
        priority: 5,
        conditions: {
            date: {
                condition: (date: string) => date >= '2014-04-01',
                pass: 50
            },
            cd4: {
                condition: (cd4: number) =>  cd4 <= 350,
                pass: 25
            },
            'cd4_modifier': {
                condition: (modifier: string) => modifier === '<',
                pass: 25
            }
        }
    },
    'CD4 less than 500 for adults after 2014': {
        concept: 'cd4 less than or equal to 500',
        minPass: 100,
        priority: 6,
        conditions: {
            date: {
                condition: (date: string) => date >= '2014-04-01',
                pass: 50
            },
            cd4: {
                condition: (cd4: number) =>  cd4 <= 500,
                pass: 25
            },
            'cd4_modifier': {
                condition: (modifier: string) => modifier === '<',
                pass: 25
            }
        }
    },
    'Women who are breast feeding': {
        concept: 'BREASTFEEDING',
        minPass: 100,
        priority: 7,
        conditions: {
            gender: {
                condition: (gender: string) => gender === 'F',
                pass: 25
            },
            'breast_feeding': {
                condition: (answer: string) => answer === 'Yes',
                pass: 25
            },
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 50
            }
        }
    },
    'Women who are pregnant': {
        concept: 'PATIENT PREGNANT',
        minPass: 100,
        priority: 8,
        conditions: {
            gender: {
                condition: (gender: string) => gender === 'F',
                pass: 25
            },
            'pregnant': {
                condition: (answer: string) => answer === 'Yes',
                pass: 25
            },
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 50
            }
        }
    },
    "Asymptomatic patient with either stage one or stage two conditions": {
        concept: 'Asymptomatic',
        minPass: 100,
        priority: 9,
        conditions: {
            stage: {
                condition: (stage: number) => stage <= 2,
                pass: 100
            } 
        }
    }
}
