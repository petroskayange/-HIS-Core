/**
 * Compares patient facts against a predefined guideline Object.
*/
export interface DescriptionInterface {
    color?: 'primary' | 'secondary' | 'danger' | 'warning';
    info: Function;
    text?: string;
    show: 'onChecked' | 'always';
}

export interface GuideLineInterface {
    title?: string;
    concept?: string;
    priority: number;
    actions?: Record<string, any>;
    description?: DescriptionInterface;
    conditions: Record<string, Function>;
}

/**
 * Match the facts with guidelines
 * @param facts 
 * @param conditions 
 * @returns 
 */
function isCondition(facts: Record<string, any>, conditions: Record<string, Function>): boolean {
    const state = [] 
    const ignored = [-1, '', null, undefined]

    for(const prop in conditions) {
        if (!(prop in facts)) 
            continue
        
        const value = facts[prop]
        if (ignored.includes(value)) {
            state.push(false)
            continue
        }

        state.push(conditions[prop](value))
    }
    return state.every(Boolean)
}

/**
 * Sort guidelines in the order of importance/relevance
 * @param findings 
 * @returns 
 */
function sortByRelevance(findings: Array<GuideLineInterface>) {
    return findings.sort((a, b) => a.priority < b.priority ? -1 : 0)
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

        if (isCondition(facts, data.conditions)) {
            data.title = guidelineIndex
            if (data.description) {
                data.description.text = data.description.info(facts)
            }
            matches.push(data)
        }
    }
    return sortByRelevance(matches)
}
