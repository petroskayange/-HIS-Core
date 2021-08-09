import { Service } from "./service";

export class WorkflowService extends Service {
    constructor() {
        super()
    }

    static nextTask(patientID: number) {
        return super.getJson(`/workflows/${super.getProgramID()}/${patientID}`, {
            date: super.getSessionDate()
        });
    }

    static async getTaskRouterParams(patientID: number, taskName='') {
        let task: string = taskName
        if (!task) {
            const { name } = await WorkflowService.nextTask(patientID)
            task = name ? name: 'Patient Dashboard'
        }

        return {
            name: task.toLowerCase(),
            params: {
                'patient_id': patientID
            }
        }
    }
}
