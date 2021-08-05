import { FieldType } from "@/components/Forms/BaseFormElements"
import MonthOptions from "@/components/FormElements/Presets/MonthOptions"
import { Field, Option } from "@/components/Forms/FieldInterface"
import HisDate from "@/utils/Date"

export interface DateFieldInterface {
    id: string;
    helpText: string;
    condition?: Function;
    validation?: Function;
    computeValue: Function;
    appearInSummary?: Function;
}

function onValidation(field: DateFieldInterface, val: Option, formData: any, computedFormData: any) {
    let data = val
    if (data) {
        if (data.value === 'Unknown') return null

        const year = formData[`year_${field.id}`] || {}
        const month = formData[`month_${field.id}`] || {}
        const day = formData[`day_${field.id}`] || {}
        data = {
            label: val.label,
            value: HisDate.stitchDate(year.value, month.value, day.value)
        }
    }
    return field.validation ? field.validation(data, formData, computedFormData) : true
}

function onCondition(field: DateFieldInterface, formData: any) {
    if (formData[`year_${field.id}`].value === 'Unknown') {
        return false
    }
    return field.condition ? field.condition(formData): true 
}

export function generateDateFields(field: DateFieldInterface, currentDate: string, estimateUnknown=false): Array<Field>{
    const yearId = `year_${field.id}`
    const monthId = `month_${field.id}`
    return [
        {
            id: yearId,
            helpText: `Year ${field.helpText}`,
            type: FieldType.TT_NUMBER,
            appearInSummary: () => false,
            condition: (f: any) => field.condition ? field.condition(f) : true,
            validation: (v: Option, f: any, c: any) => onValidation(field, v, f, c)
        },
        {
            id: monthId,
            helpText: `Month ${field.helpText}`,
            type: FieldType.TT_SELECT,
            appearInSummary: () => false,
            options: () => MonthOptions,
            condition: (f: any) => onCondition(field, f),
            validation: (v: Option, f: any, c: any) => onValidation(field, v, f, c)
        },
        {
            id: field.id,
            helpText: `Day ${field.helpText}`,
            type: FieldType.TT_MONTHLY_DAYS,
            condition: (f: any) => onCondition(field, f),
            appearInSummary: (f: any) => {
                return field.appearInSummary ? field.appearInSummary(f): true
            },
            summaryMapValue: (_: Option, f: any, computed: Record<string, any>) => ({
                label: `${field.helpText} Date`,
                value: `${computed.date} ${computed.isEstimate ? '(Estimated Date)': ''}`
            }),
            validation: (v: Option, f: any, c: any) => onValidation(field, v, f, c),
            computedValue: ({ value }: Option, f: Record<string, any>) => {
                const day = value
                let isEstimate = false
                const year = f[yearId].value
                const month = f[monthId].value
                const date =  HisDate.stitchDate(year, month, day)

                if (month === 'Unknown' || day === 'Unknown') isEstimate = true

                return field.computeValue(date, isEstimate)
            }
        },
        {
            id: `estimated_${field.id}`,
            helpText: `${field.helpText} Estimated period`,
            type: FieldType.TT_SELECT,
            summaryMapValue: ({ label }: Option, f: any, computedValue: any) => ({ 
                label: `${field.helpText} Date Estimate`,
                value: `${label} (${computedValue.date})`
            }),
            condition: (f: any) => {
                const conditions = [
                    estimateUnknown,
                    f[yearId].value === 'Unknown',
                    field.condition ? field.condition(f): true
                ]
                return conditions.every(Boolean)
            },
            computedValue: ({ value }: Option) => {
                const date = HisDate.getDateBeforeByDays(
                    currentDate, parseInt(value.toString())
                )
                return field.computeValue(date, true)
            },
            options: () => ([
                { label: '6 months ago', value: 180 },
                { label: '12 months ago', value: 365 },
                { label: '18 months ago', value: 540 },
                { label: '24 months ago', value: 730 },
                { label: 'Over 2 years ago', value: 730 }
            ])
        }
    ]
}
