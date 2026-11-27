// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Services Import
import { getCustomerById } from 'src/services/customers'

// ** Demo Components Imports
import UserViewLeft from 'src/views/apps/user/view/UserViewLeft'
import UserViewRight from 'src/views/apps/user/view/UserViewRight'

const UserView = ({ tab }) => {
  // ** Router - the customer is selected via ?id= so this one static page
  // ** serves every customer's detail view, same pattern as the Orders status filter
  const router = useRouter()
  const { id } = router.query

  // ** State
  const [customer, setCustomer] = useState(null)

  const fetchCustomer = () => {
    if (!id) return
    getCustomerById(id)
      .then(setCustomer)
      .catch(() => setCustomer(null))
  }

  useEffect(() => {
    fetchCustomer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft customer={customer} onUpdated={fetchCustomer} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <UserViewRight tab={tab} customer={customer} />
      </Grid>
    </Grid>
  )
}

export default UserView
