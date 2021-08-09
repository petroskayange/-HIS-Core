import { Option } from "@/components/Forms/FieldInterface";
import { TaskInterface } from "./TaskInterface";
import { RouteRecordRaw } from 'vue-router';

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

export interface PreferenceInterface {
    name: string;
    component?: string;
    value?: string;
    route?: string;
}
export interface AppInterface {
    readonly programID: number;
    readonly applicationName: string;
    readonly applicationIcon: string;
    readonly applicationDescription: string;
    readonly appRoutes: Array<RouteRecordRaw>;
    readonly patientDashboard: PatientDashboarInterface;
    activities: Array<ActivityInterface>;
    preferences: { [key: string]: Array<PreferenceInterface>};
    preferenceComponents?: any;
}
