export interface NavBtnInterface{
    name: string;
    size: string;
    visible: boolean;
    styleClass?: string;
    visibleOnStateChange?: Function;
    color: string;
    slot?: string;
    onClick: Function;
}