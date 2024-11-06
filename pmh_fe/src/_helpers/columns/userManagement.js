
export const userManagementColumns = () => [ //TODO: CHANGE ACCESSORS AFTER CONNECTING WITH DB
  {
    header: 'header_names.name',
    accessorKey: 'email',
    canSortBy:true,
    cell: (value) => value,
  },
  {
    header: 'header_names.role',
    accessorKey: 'userRoleList',
    cell: (value) => value.map(role => role.roleName).join(', '),
    disableSortBy: true,
  },
  {
    header: 'header_names.abilities',
    accessorKey: 'userAbilitiesList',
    cell: (value) => value.map(ability => ability.abilityName).join(', '),
    disableSortBy: true,
  },
  {
    header: 'header_names.clients',
    accessorKey: 'userClientList',
    cell: (value) => value.map(client => client.clientName).join(', '),
    disableSortBy: true,
  }
];