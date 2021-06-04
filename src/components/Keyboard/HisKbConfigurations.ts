import {
    NUMBER_PAD_LO,
    MONTHLY_DAYS_LO,
    ALPHABETICAL_LO,
    QWERTY_LO
} from "@/components/Keyboard/KbLayouts";

export interface HisKeyboardConfig {
    primaryKeyBoard: Array<any>;
    secondaryKeyboard: Array<any>;
    colSizePrimary?: number;
    colSizeSpace?: number;
    colSizeSecondary?: number;
}

export const NUMBERS_ONLY: HisKeyboardConfig = {
    colSizePrimary:4,
    colSizeSpace: 4,
    colSizeSecondary: 4,
    primaryKeyBoard: NUMBER_PAD_LO,
    secondaryKeyboard: [
        ['', ''],
        ['', ''],
        ['Unknown', 'Delete']
    ],
}

export const NUMBERS: HisKeyboardConfig = {
    colSizePrimary:4,
    colSizeSpace: 4,
    colSizeSecondary: 4,
    primaryKeyBoard: NUMBER_PAD_LO,
    secondaryKeyboard: [
        ['Unknown', 'Delete'],
        ['Qwerty', 'A-Z'],
    ],
}

export const MONTHLY_DAYS: HisKeyboardConfig = {
    primaryKeyBoard: MONTHLY_DAYS_LO,
    secondaryKeyboard: [
        [''],
        [''],
        [''],
        [''],
        ['Unknown']
    ] 
}

export const A_TO_Z: HisKeyboardConfig = {
    primaryKeyBoard: ALPHABETICAL_LO,
    secondaryKeyboard: [
        ['0-9', 'Delete'],
        ['', 'Unknown'],
        ['', 'Space']
    ]
}

export const QWERTY: HisKeyboardConfig = {
    colSizePrimary: 10,
    colSizeSecondary: 2,
    primaryKeyBoard: QWERTY_LO,
    secondaryKeyboard: [
        ['', 'Delete'],
        ['', '0-9'],
        ['', 'Unknown']
    ]
}

export const KEY_BTN_NAV = [
    {
        btn: '0-9',
        keyboard: NUMBERS
    },
    {   
        btn: 'A-Z',
        keyboard: A_TO_Z 
    },
    {
        btn: 'Qwerty',
        keyboard: QWERTY
    }
]
