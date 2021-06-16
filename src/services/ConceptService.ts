import { Service } from "./service";
import ConceptNameDictionary from "@/Data/ConceptNameDictionary"; 

export class ConceptService extends Service {
    constructor() {
        super()
    }

    static getConceptID(conceptName: string) {
        try {
            return this.getCachedConceptID(conceptName)
        } catch (e) {
            return this.getConceptIDFromApi(conceptName)
        }
    }

    static getCachedConceptID(conceptName: string) {
        const concepts = ConceptNameDictionary.filter(item => {
            return item.name.match(new RegExp(conceptName, 'i'))
        })
        return this.resolveConcept(concepts, conceptName)
    }

    static async getConceptIDFromApi(name: string) {
        const concepts = await super.getJson(`/concepts`, {name})
        return this.resolveConcept(concepts, name)
    }

    private static resolveConcept(concepts: any, conceptName: string) {
        if (concepts.length === 1) return concepts[0].concept_id

        throw `Concept name ${conceptName} was not found or has a duplicates`
    }
}