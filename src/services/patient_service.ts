import { Patient } from '@/interfaces/patient';
import { getFullName } from '@/interfaces/name'
import { getPersonAttribute } from '@/interfaces/personAttribute'
import { getPatientIdentifier } from '@/interfaces/patientIdentifier'
import { Service } from "@/services/service"

export class Patientservice extends Service {
    patient: Patient;
    constructor(patient: Patient) {
        super()
        this.patient = patient;
    }

    public static async searchByName(givenName: string, familyName: string) {
        return super.getJson(`/search/patients?given_name=${givenName}&family_name=${familyName}`)
    }

    public static toPatient(json: string): Patient {
        return JSON.parse(json);
    }

    public static patientToJson(value: Patient): string {
        return JSON.stringify(value);
    }

    getID() {
        return this.patient.patient_id
    }

    getPatientInfoString() {
        const data =  [
            this.getFullName(),
            `(${this.getGender()})`,
            this.getBirthdate(),
            `, ${this.getCurrentDistrict()}`
        ]
        return data.join(' ')
    }

    getCurrentDistrict() {
        return this.getAddresses().currentDistrict
    }

    getGender() {
        return this.patient.person.gender
    }

    getBirthdate() {
        return this.patient.person.birthdate
    }

    getFullName() {
        return getFullName(this.patient.person.names[0]);
    }

    getNationalID() {
        const ids = this.patient.patient_identifiers.filter(item => item.type.name === 'National id')
        return ids.length >= 1 ? ids[0].identifier : 'Unknown'
    }

    getHomeDistrict() {
        return this.getAddresses().ancestryDistrict
    }

    getHomeVillage() {
        return this.getAddresses().ancestryVillage
    }

    getCurrentTA() {
        return this.getAddresses().currentTA
    }

    getAttribute(personAttributeTypeID: number) {
        return getPersonAttribute(this.patient.person.person_attributes, personAttributeTypeID);
    }
    getPatientIdentifier(patientIdentifierTypeID: number) {
        return getPatientIdentifier(this.patient.patient_identifiers, patientIdentifierTypeID);
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