// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value, onExport } = props

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Button
        sx={{ mr: 4, mb: 2 }}
        color='secondary'
        variant='outlined'
        onClick={onExport}
        startIcon={<Icon icon='mdi:download-outline' fontSize={20} />}
      >
        Export CSV
      </Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 6, mb: 2 }}
          placeholder='Search Customer'
          onChange={e => handleFilter(e.target.value)}
        />

        <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
          Add Customer
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
