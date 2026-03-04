import roleService from './role.service.js';

export const getRoles = async (req, res) => {
  const roles = await roleService.getAll();
  res.json(roles);
};
