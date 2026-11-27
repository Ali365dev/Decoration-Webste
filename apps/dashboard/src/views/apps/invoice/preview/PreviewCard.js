// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Utils Import
import { formatPKR, formatKarachiDate } from 'src/@core/utils/format'

const orderStatusColors = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
  returned: 'secondary'
}

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const PreviewCard = ({ order }) => {
  // ** Hook
  const theme = useTheme()
  if (order) {
    return (
      <Card>
        <CardContent>
          <Grid container>
            <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <svg width={40} fill='none' height={22} viewBox='0 0 268 150' xmlns='http://www.w3.org/2000/svg'>
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 195.571 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fillOpacity='0.4'
                      fill='url(#paint0_linear_7821_79167)'
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 196.084 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(0.865206 0.501417 -0.498585 0.866841 173.147 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fillOpacity='0.4'
                      fill='url(#paint1_linear_7821_79167)'
                      transform='matrix(-0.865206 0.501417 0.498585 0.866841 94.1973 0)'
                    />
                    <rect
                      rx='25.1443'
                      width='50.2886'
                      height='143.953'
                      fill={theme.palette.primary.main}
                      transform='matrix(0.865206 0.501417 -0.498585 0.866841 71.7728 0)'
                    />
                    <defs>
                      <linearGradient
                        y1='0'
                        x1='25.1443'
                        x2='25.1443'
                        y2='143.953'
                        id='paint0_linear_7821_79167'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop />
                        <stop offset='1' stopOpacity='0' />
                      </linearGradient>
                      <linearGradient
                        y1='0'
                        x1='25.1443'
                        x2='25.1443'
                        y2='143.953'
                        id='paint1_linear_7821_79167'
                        gradientUnits='userSpaceOnUse'
                      >
                        <stop />
                        <stop offset='1' stopOpacity='0' />
                      </linearGradient>
                    </defs>
                  </svg>
                  <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                    {themeConfig.templateName}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    Office 149, 450 South Brand Brooklyn
                  </Typography>
                  <Typography variant='body2' sx={{ mb: 1 }}>
                    San Diego County, CA 91905, USA
                  </Typography>
                  <Typography variant='body2'>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                <Table sx={{ maxWidth: '200px' }}>
                  <TableBody>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='h6'>Order</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='h6'>{order.orderNumber}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Date Placed:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <Typography variant='body2'>{formatKarachiDate(order.createdAt)}</Typography>
                      </MUITableCell>
                    </TableRow>
                    <TableRow>
                      <MUITableCell>
                        <Typography variant='body2'>Status:</Typography>
                      </MUITableCell>
                      <MUITableCell>
                        <CustomChip
                          skin='light'
                          size='small'
                          label={order.status}
                          color={orderStatusColors[order.status] ?? 'primary'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </MUITableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        <Divider
          sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(5.5)} !important` }}
        />

        <CardContent>
          <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: { lg: 0, xs: 4 } }}>
              <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                Customer:
              </Typography>
              {order.customer ? (
                <Link
                  href={`/customers/view/overview?id=${order.customer.id}`}
                  style={{ textDecoration: 'none', color: theme.palette.primary.main }}
                >
                  <Typography variant='body2' sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    {order.customer.name}
                  </Typography>
                </Link>
              ) : (
                <Typography variant='body2' sx={{ mb: 2 }}>
                  Unknown Customer
                </Typography>
              )}
              <Typography variant='body2' sx={{ mb: 2 }}>
                {order.customer?.email}
              </Typography>
              <Typography variant='body2' sx={{ mb: 2 }}>
                {order.customer?.phone}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: ['flex-start', 'flex-end'] }}>
              <div>
                <Typography variant='subtitle2' sx={{ mb: 3, color: 'text.primary', letterSpacing: '.1px' }}>
                  Ship To:
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>Address:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{order.shippingAddress?.address}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>City:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{order.shippingAddress?.city}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='body2'>Payment Method:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography variant='body2'>{order.paymentMethod}</Typography>
                        </MUITableCell>
                      </TableRow>
                      {order.trackingNumber && (
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>Tracking:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2' sx={{ fontWeight: 600, color: 'primary.main' }}>
                              {order.courier ? `${order.courier} · ` : ''}{order.trackingNumber}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: '0 !important' }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map(item => (
                <TableRow key={item.productId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{formatPKR(item.price)}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>{formatPKR(item.price * item.qty)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CardContent sx={{ pt: 8 }}>
          <Grid container>
            <Grid item xs={12} sm={7} lg={9} sx={{ order: { sm: 1, xs: 2 } }}>
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant='body2'
                  sx={{ mr: 2, color: 'text.primary', fontWeight: 600, letterSpacing: '.25px' }}
                >
                  Payment Method:
                </Typography>
                <Typography variant='body2'>{order.paymentMethod}</Typography>
              </Box>

              <Typography variant='body2'>Thank you for shopping with us!</Typography>
            </Grid>
            <Grid item xs={12} sm={5} lg={3} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
              <CalcWrapper>
                <Typography variant='body2'>Subtotal:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  {formatPKR(order.subtotal)}
                </Typography>
              </CalcWrapper>
              <CalcWrapper>
                <Typography variant='body2'>Shipping:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  {formatPKR(order.shipping)}
                </Typography>
              </CalcWrapper>
              <Divider
                sx={{ mt: theme => `${theme.spacing(5)} !important`, mb: theme => `${theme.spacing(3)} !important` }}
              />
              <CalcWrapper>
                <Typography variant='body2'>Total:</Typography>
                <Typography variant='body2' sx={{ color: 'text.primary', letterSpacing: '.25px', fontWeight: 600 }}>
                  {formatPKR(order.total)}
                </Typography>
              </CalcWrapper>
            </Grid>
          </Grid>
        </CardContent>

        <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />

      </Card>
    )
  } else {
    return null
  }
}

export default PreviewCard
