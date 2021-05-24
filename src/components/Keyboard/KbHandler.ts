export default function kbHandler(newInput: string, accumulator: string): string {
    let output = accumulator

    if (newInput.match(/delete/i)) {
        output = output.substring(0, output.length - 1)
    } else if (newInput.match(/space/i)) {
        output = `${accumulator} `
    } else {
        output = `${accumulator}${newInput}`
    }
    return output

}