// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import UsersInvoiceListTable from 'src/views/apps/user/view/UsersInvoiceListTable'

const UserViewOverview = ({ customer }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UsersInvoiceListTable customerId={customer?.id} />
      </Grid>
    </Grid>
  )
}

export default UserViewOverview
