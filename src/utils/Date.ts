import dayjs from "dayjs";

const STANDARD_DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD/MMM/YYYY'

function currentDisplayDate() {
    return dayjs().format(DISPLAY_DATE_FORMAT)
}

function getAgeInYears(date: string | Date): number {
    return dayjs().diff(date, 'years');
}

function toStandardHisTimeFormat(date: string | Date) {
    return dayjs(date).format('HH:MM')
}

function toStandardHisDisplayFormat(date: string | Date): string {
    return dayjs(date).format(DISPLAY_DATE_FORMAT)
}

function toStandardHisFormat(date: string | Date): string {
    return dayjs(date).format(STANDARD_DATE_FORMAT)
}

function estimateDateFromAge(age: number): string {
    const date = dayjs().subtract(age, 'years')
    return date.format(STANDARD_DATE_FORMAT)
}

function getYearFromAge(age: number) {
    return dayjs().subtract(age, 'years').year()
}

function dateIsAfter(date: string) { return dayjs().isAfter(date) }

function getCurrentYear() { return dayjs().year() }

function stitchDate(year: number | string, month='01', day='01') {
    return toStandardHisFormat(`${year}-${month}-${day}`)
}

export default {
    getAgeInYears,
    toStandardHisTimeFormat,
    toStandardHisDisplayFormat,
    currentDisplayDate,
    dateIsAfter,
    stitchDate,
    toStandardHisFormat,
    estimateDateFromAge,
    getYearFromAge,
    getCurrentYear
}