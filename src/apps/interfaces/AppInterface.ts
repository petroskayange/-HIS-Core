import { Option } from "@/components/Forms/FieldInterface";
import { TaskInterface } from "./TaskInterface";

interface ProgramCardInfoInterface {
    (programInfo: any): Array<Option>;
}

interface AlertsInterface {
    (id: number): Promise<Option[]>;
}

interface PatientDashboardConfig {
    readonly alerts: AlertsInterface;
    readonly programCardInfo: ProgramCardInfoInterface;
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
    activities: Array<ActivityInterface>;
    readonly tasks?: Record<string, TaskInterface[]>;
    readonly patientDashboard?: PatientDashboardConfig;
}
