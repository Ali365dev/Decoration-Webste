// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiTabList from '@mui/lab/TabList'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Tabs Imports
import TabGeneral from 'src/views/settings/TabGeneral'
import TabStore from 'src/views/settings/TabStore'
import TabPayments from 'src/views/settings/TabPayments'
import TabShipping from 'src/views/settings/TabShipping'
import TabTax from 'src/views/settings/TabTax'
import TabNotifications from 'src/views/settings/TabNotifications'
import TabSeo from 'src/views/settings/TabSeo'

// ** Reuses the exact TabList styling from views/pages/account-settings/AccountSettings.js
const TabList = styled(MuiTabList)(({ theme }) => ({
  '& .MuiTabs-indicator': { display: 'none' },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    minWidth: 65,
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: { minWidth: 130 }
  }
}))

const TABS = [
  { value: 'general', label: 'General', icon: 'mdi:account-outline', component: <TabGeneral /> },
  { value: 'store', label: 'Store Info', icon: 'mdi:storefront-outline', component: <TabStore /> },
  { value: 'payments', label: 'Payments', icon: 'mdi:cash-multiple', component: <TabPayments /> },
  { value: 'shipping', label: 'Shipping', icon: 'mdi:truck-outline', component: <TabShipping /> },
  { value: 'tax', label: 'Tax', icon: 'mdi:receipt-text-outline', component: <TabTax /> },
  { value: 'notifications', label: 'Notifications', icon: 'mdi:bell-outline', component: <TabNotifications /> },
  { value: 'seo', label: 'SEO', icon: 'mdi:magnify', component: <TabSeo /> }
]

/**
 * Settings shell: same TabContext/TabList shape as
 * views/pages/account-settings/AccountSettings.js, repurposed for store
 * settings tabs instead of personal account tabs.
 */
const Settings = ({ tab }) => {
  const [activeTab, setActiveTab] = useState(tab)
  const router = useRouter()
  const hideText = useMediaQuery(theme => theme.breakpoints.down('md'))

  useEffect(() => {
    if (tab && tab !== activeTab) setActiveTab(tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  const handleChange = (event, value) => {
    setActiveTab(value)
    router.push(`/settings/${value}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <TabList variant='scrollable' scrollButtons='auto' onChange={handleChange} aria-label='settings tabs'>
                {TABS.map(t => (
                  <Tab
                    key={t.value}
                    value={t.value}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', ...(!hideText && { '& svg': { mr: 2 } }) }}>
                        <Icon icon={t.icon} />
                        {!hideText && t.label}
                      </Box>
                    }
                  />
                ))}
              </TabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel sx={{ p: 0 }} value={activeTab}>
                {TABS.find(t => t.value === activeTab)?.component}
              </TabPanel>
            </Grid>
          </Grid>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default Settings
