// ** Mock Adapter
import mock from 'src/@fake-db/mock'

// ** Phase 7: permission names and assignedTo roles relabeled from generic
// ** demo data to store-specific actions and roles (administrator -> owner,
// ** manager -> store-manager, users -> catalog-editor, support stays, and a
// ** new order-fulfillment role is added). The list/search/edit UI and
// ** fake-db plumbing are untouched.
const data = {
  permissions: [
    {
      id: 1,
      name: 'Store Management',
      assignedTo: ['owner'],
      createdDate: '14 Apr 2026, 8:43 PM'
    },
    {
      id: 2,
      assignedTo: ['owner'],
      name: 'Manage Staff & Roles',
      createdDate: '16 Sep 2026, 5:20 PM'
    },
    {
      id: 3,
      name: 'Add & Remove Products',
      createdDate: '14 Oct 2026, 10:20 AM',
      assignedTo: ['owner', 'store-manager', 'catalog-editor']
    },
    {
      id: 4,
      name: 'Manage Promotions & Campaigns',
      createdDate: '14 Oct 2026, 10:20 AM',
      assignedTo: ['owner', 'store-manager']
    },
    {
      id: 5,
      name: 'Process Orders & Fulfillment',
      createdDate: '23 Aug 2026, 2:00 PM',
      assignedTo: ['owner', 'store-manager', 'order-fulfillment']
    },
    {
      id: 6,
      name: 'Customer Communication',
      createdDate: '15 Apr 2026, 11:30 AM',
      assignedTo: ['owner', 'store-manager', 'support']
    },
    {
      id: 7,
      name: 'View Reports Only',
      createdDate: '04 Dec 2026, 8:15 PM',
      assignedTo: ['owner', 'store-manager']
    },
    {
      id: 8,
      name: 'Verify Payments & Refunds',
      createdDate: '25 Feb 2026, 10:30 AM',
      assignedTo: ['owner', 'store-manager']
    },
    {
      id: 9,
      name: 'Manage Stock & Inventory',
      createdDate: '04 Nov 2026, 11:45 AM',
      assignedTo: ['owner', 'store-manager', 'order-fulfillment']
    }
  ]
}

// ------------------------------------------------
// GET: Return Permissions List
// ------------------------------------------------
mock.onGet('/apps/permissions/data').reply(config => {
  const { q = '' } = config.params
  const queryLowered = q.toLowerCase()

  const filteredData = data.permissions.filter(
    permissions =>
      permissions.name.toLowerCase().includes(queryLowered) ||
      permissions.createdDate.toLowerCase().includes(queryLowered) ||
      permissions.assignedTo.some(i => i.toLowerCase().startsWith(queryLowered))
  )

  return [
    200,
    {
      params: config.params,
      allData: data.permissions,
      permissions: filteredData,
      total: filteredData.length
    }
  ]
})
