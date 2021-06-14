import moment from "moment";

const STANDARD_DATE_FORMAT = 'YYYY-MM-DD'

function toStandardHisFormat(date: string | Date): string {
    return moment(date).format(STANDARD_DATE_FORMAT)
}

function estimateDateFromAge(age: number): string {
    const date = moment().subtract(age, 'years')
    return date.format(STANDARD_DATE_FORMAT)
}

function getYearFromAge(age: number) {
    return moment().subtract(age, 'years').year()
}

function dateIsAfter(date: string) { return moment().isAfter(date) }

function getCurrentYear() { return moment().year() }

function stitchDate(year: number | string, month='01', day='01') {
    return toStandardHisFormat(`${year}-${month}-${day}`)
}

export default {
    dateIsAfter,
    stitchDate,
    toStandardHisFormat,
    estimateDateFromAge,
    getYearFromAge,
    getCurrentYear
}