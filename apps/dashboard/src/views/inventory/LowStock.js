// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getLowStock, adjustStock, setLowStockThreshold } from 'src/services/inventory'

const ThresholdCell = ({ row, onSaved }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(row.reorderLevel)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (Number(value) === row.reorderLevel) {
      setEditing(false)

      return
    }
    setSaving(true)
    await setLowStockThreshold(row.productId, value)
    setSaving(false)
    setEditing(false)
    toast.success(`Threshold updated to ${value}`)
    onSaved()
  }

  if (editing) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          size='small'
          type='number'
          value={value}
          onChange={e => setValue(e.target.value)}
          sx={{ width: 70 }}
          inputProps={{ min: 0 }}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
        />
        <IconButton size='small' color='success' disabled={saving} onClick={handleSave}>
          <Icon icon='mdi:check' fontSize={16} />
        </IconButton>
        <IconButton size='small' onClick={() => setEditing(false)}>
          <Icon icon='mdi:close' fontSize={16} />
        </IconButton>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant='body2'>{row.reorderLevel} units</Typography>
      <Tooltip title='Edit threshold'>
        <IconButton size='small' onClick={() => setEditing(true)}>
          <Icon icon='mdi:pencil-outline' fontSize={14} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

const LowStock = () => {
  const [rows, setRows] = useState([])

  const fetchLowStock = useCallback(async () => {
    const data = await getLowStock()
    setRows(data.stock)
  }, [])

  useEffect(() => {
    fetchLowStock()
  }, [fetchLowStock])

  const handleRestock = async row => {
    await adjustStock(row.productId, 50, 'restock', 'Quick restock from Low Stock screen')
    toast.success(`${row.productName} restocked (+50 units)`)
    fetchLowStock()
  }

  const columns = [
    { flex: 0.1, field: 'sku', minWidth: 110, headerName: 'SKU' },
    { flex: 0.3, field: 'productName', minWidth: 240, headerName: 'Product' },
    {
      flex: 0.12,
      field: 'stock',
      minWidth: 110,
      headerName: 'Stock',
      renderCell: ({ row }) => (
        <CustomChip
          size='small'
          skin='light'
          color={row.stock === 0 ? 'error' : 'warning'}
          label={`${row.stock} units`}
        />
      )
    },
    {
      flex: 0.18,
      field: 'reorderLevel',
      minWidth: 180,
      sortable: false,
      headerName: 'Alert Threshold',
      renderCell: ({ row }) => <ThresholdCell row={row} onSaved={fetchLowStock} />
    },
    {
      flex: 0.18,
      field: 'actions',
      minWidth: 150,
      sortable: false,
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <Button
          size='small'
          variant='outlined'
          startIcon={<Icon icon='mdi:truck-fast-outline' />}
          onClick={() => handleRestock(row)}
        >
          Restock +50
        </Button>
      )
    }
  ]

  return (
    <Card>
      <CardHeader
        title='Low Stock'
        subheader={`${rows.length} products at or below their reorder threshold`}
      />
      <Box sx={{ height: 560 }}>
        <DataGrid getRowId={row => row.productId} rows={rows} columns={columns} />
      </Box>
    </Card>
  )
}

export default LowStock
