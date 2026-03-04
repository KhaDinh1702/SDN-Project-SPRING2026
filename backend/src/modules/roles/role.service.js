import Role from '../../models/Role.js';

class RoleService {
  getAll() {
    return Role.find();
  }
}

export default new RoleService();
