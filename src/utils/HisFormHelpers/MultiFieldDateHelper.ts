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
        if (data.value === 'Unknown') {
            return null
        }
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

export function generateDateFields(field: DateFieldInterface): Array<Field>{
    const yearId = `year_${field.id}`
    const monthId = `month_${field.id}`
    return [
        {
            id: yearId,
            helpText: `Year ${field.helpText}`,
            type: FieldType.TT_NUMBER,
            appearInSummary: () => false,
            validation: (v: Option, f: any, c: any) => onValidation(field, v, f, c),
            condition: (f: any) => field.condition ? field.condition(f) : true
        },
        {
            id: monthId,
            helpText: `Month ${field.helpText}`,
            type: FieldType.TT_SELECT,
            appearInSummary: () => false,
            options: () => MonthOptions,
            validation: (v: Option, f: any, c: any) => onValidation(field, v, f, c),
            condition: (f: any) => onCondition(field, f)
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
        }
    ]
}

