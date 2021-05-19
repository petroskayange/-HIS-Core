export enum FieldType {
    TT_TEXT,
    TT_DATETIME,
    TT_SELECT,
    TT_MULTIPLE_SELECT
}

export interface Option {
    label: string,
    value: string | number
}

export interface Field {
    id: string | number;
    help_text: string;
    type: FieldType;
    condition: Function;
    validation: Function;
    options: Array<Option>;
    require_next?: Boolean;
}