function parameterizeObjToString(obj: Record<string, string>) {
    let str = ''
    for(const [key, value] of Object.entries(obj)) {
        str += `${key}=${value}&`
    }
    return str
}

export default {
    parameterizeObjToString
}