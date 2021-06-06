export function required(value: any, msg=null): null | Array<string> {
    const noneFalsy = [undefined, '', null]
    return noneFalsy.includes(value.label) ? [msg || 'Field is empty!']: null
}

export function isName(value: any, msg=null): null | Array<string> {
    const validation = /^(?=.{2,100}$)[a-z!A-Z]+(?:['_.\-!\][a-z]+[a-z!A-Z])*$/
    return !value || !value.label.match(validation) ? [msg || 'Invalid name Input']: null
}