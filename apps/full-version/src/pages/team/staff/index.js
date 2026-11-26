// ** Phase 7: Staff Members now has its own real entity/service (src/@fake-db/apps/staff.js,
// ** src/services/staff.js) instead of the Phase 2 thin wrapper around Customers.
import StaffList from 'src/views/team/StaffList'

const StaffPage = () => {
  return <StaffList />
}

export default StaffPage
