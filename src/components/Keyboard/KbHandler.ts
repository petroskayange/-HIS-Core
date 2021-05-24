export default function kbHandler(
    newInput: string | number, 
    accumulator: string | number): string {

    return `${accumulator}${newInput}`
}