export interface NavBtnInterface{
    name: string;
    size: string;
    visible: boolean;
    visibleOnStateChange?: Function;
    color: string;
    slot?: string;
    onClick: Function;
}