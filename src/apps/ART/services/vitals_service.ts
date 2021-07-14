import { ConceptService } from "@/services/concept_service";
import { Option } from "@/components/Forms/FieldInterface";
import { isArray } from "lodash";
export class VitalsService {
  vitals: Option[];
  constructor(vitals: Option[]) {
    this.vitals = vitals;
  }
  isNotEmptyandNumber(vital: any) {
    return `${vital.value}`.match(/^-?\d+\.?\d*$/) ? null : [`Invalid entry for ${vital.label}`]
  }
  isNotEmptyandFloat(vital: any) {
    return `${vital.value}`.match(/^-?\d+\.\d*$/) ? null : [`Invalid entry for ${vital.label}`]
  }
  checkMinMax(val: Option, min: number, max: number) {
    const p = [];
    if(parseFloat(`${val.value}`) < min) {
      p.push([`${val.label} entered is less than minimum ${val.label}`])
    }
    if(parseFloat(`${val.value}`) > max) {
      p.push([`${val.label} entered is greater than maximum ${val.label}`])
    }
    return p.length > 0 ? p : null;
  }
  validateAll() {
    const p: any = []; 
    this.vitals.map( vital => {
      const j =  this.validator(vital);
      return isArray(j) ? p.push(j) : null 
    })
    return p.length > 0 ? p : null;
  }
  validator(vital: Option) {

    const values = [
      {
        name: "Weight",
        validator: (val: any) => {
          const errors = [];
          const emptyErrors = this.isNotEmptyandFloat(val);
          const minErrors = this.checkMinMax(val, 1, 300);
          if(isArray(emptyErrors)) {
            errors.push(emptyErrors)
          }
          if(isArray(minErrors)) {
            errors.push(minErrors)
          }
          return errors.length > 0 ? errors : null 
        },
      },
      {
        name: "Height",
        validator: (val: any) => {
          const errors = [];
          const emptyErrors = this.isNotEmptyandNumber(val);
          const minErrors = this.checkMinMax(val, 40, 220);
          if(isArray(emptyErrors)) {
            errors.push(emptyErrors)
          }
          if(isArray(minErrors)) {
            errors.push(minErrors)
          }
          return errors.length > 0 ? errors : null 
        },
      }, {
        name: "BP",
        validator: (val: any) => {
          return this.isNotEmptyandNumber(val)
        },
      }, {
        name: "Temp",
        validator: (val: any) => {
          return null
        },
      }, {
        name: "SP02",
        validator: (val: any) => {
          return null
        },
      }, {
        name: "Pulse",
        validator: (val: any) => {
          return null
        },
      }
    ]
    const v = values.filter(element => {
     return element.name === vital.label;
    });
    if(v.length > 0) {
      return v[0].validator(vital);
    }
    return null
  }
}