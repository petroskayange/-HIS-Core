function parameterizeObjToString(obj: Record<string, string> | Record<string, number>) {
    let str = ''
    for(const [key, value] of Object.entries(obj)) {
        str += `${key}=${value}&` 
    }
    return str
}

export default {
    parameterizeObjToString
}