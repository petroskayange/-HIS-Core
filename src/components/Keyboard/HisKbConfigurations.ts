/**
 * Default keyboard configurations.
 * 
 * Configuration consists of one or two keyboard layouts
 * to be displayed at once.
 */

import {
    NUMBER_PAD_LO,
    MONTHLY_DAYS_LO,
    ALPHABETICAL_LO,
    QWERTY_LO
} from "@/components/Keyboard/KbLayouts";

export const NUMBERS_ONLY = [
    NUMBER_PAD_LO,
    [
        ['Unknown', 'Delete']
    ]
]
export const NUMBERS = [
    NUMBER_PAD_LO,
    [
        ['Unknown', 'Delete'],
        ['Qwerty', 'A-Z'],
    ]
]

export const MONTHLY_DAYS = [
    MONTHLY_DAYS_LO,
    [
        ['Unknown']
    ]
]

export const A_TO_Z = [
    ALPHABETICAL_LO,
    [
        ['0-9', 'Delete'],
        ['Qwerty', 'Unknown'],
        ['', 'Space']
    ]
]

export const QWERTY = [
    QWERTY_LO,
    [
        ['', 'Delete'],
        ['', '0-9'],
        ['', 'Unknown']
    ]
]

/**
 * Navigation map for switching between different keyboard layouts
 */
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
