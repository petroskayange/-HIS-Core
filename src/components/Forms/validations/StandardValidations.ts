function required(value: any): null | Array<string> {
    const noneFalsy = [undefined, '', null]
    const msg = ['Field is empty!']
    
    if (noneFalsy.includes(value)) return msg

    if (noneFalsy.includes(value.label)) return msg
    
    return null
}

function isName(value: any): null | Array<string> {
    const validation = /^(?=.{2,100}$)[a-z!A-Z]+(?:['_.\-!\][a-z]+[a-z!A-Z])*$/
    return !value || !value.label.match(validation) ? ['Invalid name Input']: null
}

function isNumber(val: any): null | Array<string> {
    return isNaN(parseInt(val.value)) ? ['Value must be a number'] : null
}

function hasLengthRangeOf(val: any, min: number, max: number): null | Array<string> {
    const len = val ? val.label.length : 0
    return len >= min && len <= max ? null : [`Value length not within range of ${min} - ${max}`] 
}

function rangeOf(val: any, min: number, max: number): null | Array<string> {
    const value = parseInt(val.label)
    return value >= min && value <= max ? null: [`${value} not within range of ${min} - ${max}`]
}

export default {
    required,
    isName,
    isNumber,
    hasLengthRangeOf,
    rangeOf
}