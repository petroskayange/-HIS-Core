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

export interface DescriptionInterface {
    color?: 'primary' | 'secondary' | 'danger' | 'warning';
    info: Function;
    text?: string;
    show: 'onChecked' | 'always';
}

export interface GuideLineInterface {
    concept?: string;
    minPass: number;
    passMark?: number;
    priority: number;
    actions?: Record<string, any>;
    description?: DescriptionInterface;
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

        if (facts[prop] === null) 
            continue

        const validator = conditions[prop]
        if (validator.condition(facts[prop])) {
            passMark += validator.pass
        }
    }

    return passMark
}

/**
 * Sort guidelines in the order of importance/relevance
 * @param findings 
 * @returns 
 */
function sortByRelevance(findings: Array<GuideLineInterface>) {
    return findings.sort((a, b) => {
        if (a.priority < b.priority || (a.priority === b.priority && a.minPass > b.minPass)) {
            return  -1
        }
        return 0
    })
}

/**
 * Check the guideline for matching facts and return matching object 
 * when passMark is greater the minimum passmark
 * @param facts 
 * @param guidelines 
 * @returns 
 */
export function matchToGuidelines(facts: Record<string, any>, guidelines: Array<GuideLineInterface>) {
    const matches = []
    for(const guidelineIndex in guidelines) {
        const data: GuideLineInterface = guidelines[guidelineIndex]
        const passMark = calculatePassMark(facts, data.conditions)

        if (passMark >= data.minPass) {
            data.passMark = passMark
            if (data.description) {
                data.description.text = data.description.info(facts)
            }
            matches.push(data)
        }
    }
    return sortByRelevance(matches)
}
