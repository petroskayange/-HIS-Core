export enum FieldType {
    TT_TEXT="text-input",
    TT_DATETIME="datetime",
    TT_SELECT="single-select",
    TT_MULTIPLE_SELECT="multiple-select"
}

export interface Option {
    label: string;
    value: string | number;
    isChecked?: boolean;
}

export interface Field {
    id: string | number;
    helpText: string;
    type: FieldType;
    condition?: Function;
    prepend?: boolean;
    prependValue?: string;
    validation?: Function;
    options: Array<Option>;
    requireNext?: boolean;
}