import {PatientIdentifierType} from '@/interfaces/patientIdentifierType';

export interface PatientIdentifier {
    patient_identifier_id: number;
    patient_id:            number;
    identifier:            string;
    identifier_type:       number;
    preferred:             number;
    location_id:           number;
    creator:               number;
    date_created:          Date;
    voided:                number;
    voided_by:             null;
    date_voided:           null;
    void_reason:           null;
    uuid:                  string;
    type:                  PatientIdentifierType;
}
 export const getAttribute = (patientIdentifiers: PatientIdentifier[], patientIdentifierTypeName: string): string=> {
        let attribute = patientIdentifiers.filter(attr => {
          return attr.type.name === patientIdentifierTypeName;
        });
        return attribute.length > 0 ? attribute[0].identifier : "";
}