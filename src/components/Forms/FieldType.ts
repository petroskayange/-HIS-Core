export enum FieldType {
    TT_TEXT="text",
    TT_DATETIME="datetime",
    TT_SELECT="select",
    TT_MULTIPLE_SELECT="select-multiple"
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
    validation?: Function;
    options: Array<Option>;
    requireNext?: boolean;
}