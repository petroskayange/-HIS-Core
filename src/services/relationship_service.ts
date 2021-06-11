import { Service } from '@/services/service'
import { getFullName } from '@/interfaces/name'
import { Relationship } from '@/interfaces/relationship'
export class RelationshipService extends Service {
	constructor() {
		super()
	}

	static getRelationships(patientID: number) {
		return super.getJson(`/people/${patientID}/relationships`);
	}

	static async getGuardianDetails(patientID: number) {
		return await this.getRelationships(patientID).then((relation: Relationship[]) => {
			return relation.map((element: Relationship) => {
				return {
					name: getFullName(element.relation.names[0]),
					relationshipType: element.type.b_is_to_a
				}
			});
		});
	}
}