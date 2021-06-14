import { Service } from '@/services/service'

export class ProgramService extends Service {
    constructor() {
        super()
    }

    static getProgramInformation(patientID: number) {
        return super.getJson(`/programs/${super.programID}/patients/${patientID}`);
    }
    
    static getNextTask(patientID: number) {
        return super.getJson(`/workflows/${super.programID}/${patientID}date=${super.sessionDate}`);
    }
    
    static getFastTrackStatus(patientID: number) {
        return super.getJson(`/on_fast_track?person_id=${patientID}&date=${super.sessionDate}`);
    }
}