export const rolesInfo = {
  superadmin: { id: 1, role: 'superadmin', name: 'super_admin' },
  internalreadonly: {
    id: 3,
    role: 'internalreadonly',
    name: 'internal_read_only',
  },
  internal: { id: 4, role: 'internal', name: 'internal' },
};

export const getRolesInfoById = (id) => {
  for (const key in rolesInfo) {
    if (rolesInfo[key].id === id) return rolesInfo[key];
  }
};
