import { Service } from "./service";

export class RegimenService extends Service {
    constructor() {
        super()
    }

    static getRegimens() {
        return this.getJson(`programs/${this.getProgramID()}/regimens`)
    }
}