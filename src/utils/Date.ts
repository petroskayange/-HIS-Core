import dayjs from "dayjs";

const STANDARD_DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'DD/MMM/YYYY'

function currentDisplayDate() {
    return dayjs().format(DISPLAY_DATE_FORMAT)
}

function dateDiffInDays(date1: string, date2: string) {
    return dayjs(date1).diff(date2, 'days')
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

function stitchDate(year: number | string, month=-1 as number | string, day=-1 as number | string) {
    let fmonth = month
    let fday = day

    const unknown = (d: number | string) => d.toString().match(/Unknown/i) 

    if (!month || unknown(month)) {
        fmonth = dayjs().month()
    }

    if (!day || unknown(day)) {
        fday = dayjs().day()
    }

    return toStandardHisFormat(`${year}-${fmonth}-${fday}`)
}

export default {
    dateDiffInDays,
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