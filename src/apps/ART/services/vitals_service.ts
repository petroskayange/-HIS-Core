import { ConceptService } from "@/services/concept_service";

class VitalsService {
  vitals: Array<any>;
  constructor(vitals: any) {
    this.vitals = vitals;
  }

  static async validator() {

    const values = [
      {
        name: "Weight",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      },
      {
        name: "Height",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      }, {
        name: "BP",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      }, {
        name: "Temp",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      }, {
        name: "SP02",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      }, {
        name: "Pulse",
        validator: (val: any) => {
          return null
        },
        conceptID: await ConceptService.getConceptID(this.name, true)
      }
    ]
  }
}