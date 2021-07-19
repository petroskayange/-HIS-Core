import { isEmpty } from "lodash"

const META_METHODS: any = {
    "less_than": (constNum: number, num: number) => {
        return num < constNum
    },
    "less_than_equal": (constNum: number, num: number) => {
        return num <= constNum
    },
    "greater_than": (constNum: number, num: number) => {
        return num > constNum
    },
    "greater_than_equal": (constNum: number, num: number) => {
        return num >= constNum
    },
    "equal_to": (constVal: number | string, val: number | string) => {
        return constVal === val
    },
    "between": (constRange: Array<number>, val: number) => {
        const [min, max] = constRange
        return val >= min && val <= max
    }
}

function runMetaMethod(methodName: string, constVal: any, varValue: string | number) {
    if (methodName in META_METHODS) {
        return META_METHODS[methodName](constVal, varValue)
    }
    return false
}

function validateMeta(variables: Record<string, number | string>, meta: Array<any>) {
    if (isEmpty(meta)) return false

    for(const index in meta) {        
        if (!(index in variables)) continue

        const metaFunc: string = Object.keys(meta[index])[0]
        const metaValue: any = meta[index][metaFunc]
        const varValue: string | number = variables[index]

        if (!runMetaMethod(metaFunc, metaValue, varValue)) return false
    }
    return true
}
export default validateMeta