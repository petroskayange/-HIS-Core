import { Service } from '@/services/service'

export class ProgramService extends Service {
    constructor() {
        super()
    }

    static getProgramInformation(patientID: number) {
        return super.getJson(`/programs/${sessionStorage.programID}/patients/${patientID}`);
    }
    
    static getNextTask(patientID: number) {
        return super.getJson(`/workflows/${sessionStorage.programID}/${patientID}date=${sessionStorage.sessionDate}`);
    }
    
    static getFastTrackStatus(patientID: number) {
        return super.getJson(`/on_fast_track?person_id=${patientID}&date=${sessionStorage.sessionDate}`);
    }
}