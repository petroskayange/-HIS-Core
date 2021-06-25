import { Option } from "@/components/Forms/FieldInterface";
import { TaskInterface } from "./TaskInterface";

interface ProgramCardInfoInterface {
    (programInfo: any): Array<Option>;
}

interface AlertsInterface {
    (id: number): Promise<Option[]>;
}

interface PatientDashboarInterface {
    readonly alerts: AlertsInterface;
    readonly programCardInfo: ProgramCardInfoInterface;
    readonly tasks: Record<string, TaskInterface[]>;
}

export interface ActivityInterface {
    readonly value: string;
    selected: boolean;
}

export interface AppInterface {
    readonly programID: number;
    readonly applicationName: string;
    readonly applicationIcon: string;
    readonly applicationDescription: string;
    readonly patientDashboard: PatientDashboarInterface;
    activities: Array<ActivityInterface>;
}