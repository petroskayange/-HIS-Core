/**
 * Compares patient facts against a predefined guideline Object.
 * 
 * When a fact matches a guideline condition, the guideline object is returned.
 * 
 * The passMark calculated from the 
 */
export interface ConditionInterface {
    condition: Function;
    pass: number;
}

export interface GuideLineInterface {
    concept?: string;
    minPass: number;
    conditions: Record<string, ConditionInterface>;

}

/**
 * Match the facts with guidelines and accumulate a passing mark score
 * @param facts 
 * @param conditions 
 * @returns 
 */
function calculatePassMark(facts: Record<string, any>, conditions: Record<string, ConditionInterface>): number {
    let passMark = 0
    
    for(const prop in conditions) {
        if (!(prop in facts)) 
            continue

        const validator = conditions[prop]

        if (validator.condition(facts[prop])) {
            passMark += validator.pass
        }
    }

    return passMark
}
/**
 * Check the guideline for matching facts and return matching object 
 * when passMark is greater the minimum passmark
 * @param facts 
 * @param guidelines 
 * @returns 
 */
export function analyse(facts: Record<string, any>, guidelines: Array<GuideLineInterface>) {
    for(const guidelineIndex in guidelines) {
        const data: GuideLineInterface = guidelines[guidelineIndex]
        const passMark = calculatePassMark(facts, data.conditions)
        
        if (passMark >= data.minPass) return data
    }
    return {}
}

