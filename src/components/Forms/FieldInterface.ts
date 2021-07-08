import { FieldType } from "@/components/Forms/BaseFormElements"

export interface Option {
    label: string;
    value: string | number;
    other?: any;
    isChecked?: boolean;
}

export interface Field {
    id: string | number;
    helpText: string;
    type: FieldType;
    group?: string;  // Categories fields with related data
    preset?: Option | Record<string, any>;
    condition?: Function;
    validation?: Function;
    onValue?: Function;
    options?(fdata?: any): Promise<Option[]> | Array<Option>;
    requireNext?: boolean;
    config?: Record<string, any>;
}
