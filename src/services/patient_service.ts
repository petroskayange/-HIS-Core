import { Patient } from '@/interfaces/patient';
import { getFullName } from '@/interfaces/name'
import { getPersonAttribute } from '@/interfaces/personAttribute'
export class Patientservice {
    patient: Patient;
    constructor(patient: Patient) {
        this.patient = patient;
    }
    public static toPatient(json: string): Patient {
        return JSON.parse(json);
    }

    public static patientToJson(value: Patient): string {
        return JSON.stringify(value);
    }
    getFullName() {
        return getFullName(this.patient.person.names[0]);
    }
    getAttribute(personAttributeTypeID: number) {
        return getPersonAttribute(this.patient.person.person_attributes, personAttributeTypeID);
    }
    getAddresses() {
        const addressOBJ = {
            ancestryDistrict: '',
            ancestryTA: '',
            ancestryVillage: '',
            currentDistrict: '',
            currentTA: '',
            currentVillage: '',
        }
        if (this.patient.person.addresses.length > 0) {
            const addresses = this.patient.person.addresses[0];

            addressOBJ.ancestryDistrict = addresses.address2;
            addressOBJ.ancestryTA = addresses.county_district;
            addressOBJ.ancestryVillage = addresses.neighborhood_cell;
            addressOBJ.currentDistrict = addresses.state_province;
            addressOBJ.currentTA = addresses.township_division;
            addressOBJ.currentVillage = addresses.city_village;
        }
        return addressOBJ;
    }

}