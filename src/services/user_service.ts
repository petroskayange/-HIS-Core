import { Role } from "@/interfaces/role";
import { Service } from "./service";

export class UserService extends Service {
  userRoles = sessionStorage.use
	constructor() {
		super()
	}
	static isAdmin() {
    const roles = JSON.parse(super.userRoles).filter(
        (role: Role) => {
          return role.role.match(/super|admin/i);
        }
      );
      return roles.length > 0;
	}
}