// ** React Imports
import { useEffect, useState, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Third Party Imports
import toast from 'react-hot-toast'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Services Import
import { getStock, adjustStock } from 'src/services/inventory'

const stockColor = stock => {
  if (stock === 0) return 'error'
  if (stock <= 10) return 'warning'

  return 'success'
}

/**
 * Stock Management screen: an inline-editable DataGrid (same mechanic as
 * views/table/data-grid/TableEditable.js) where editing the "Stock" cell
 * writes straight through to the shared Product.stock value and appends a
 * Stock History entry via the inventory service.
 */
const StockManagement = () => {
  // ** State
  const [rows, setRows] = useState([])

  const fetchStock = useCallback(async () => {
    const data = await getStock()
    setRows(data.stock)
  }, [])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  const processRowUpdate = async newRow => {
    const oldRow = rows.find(r => r.productId === newRow.productId)
    const delta = Number(newRow.stock) - oldRow.stock
    if (delta !== 0) {
      await adjustStock(newRow.productId, delta, 'adjustment', 'Manual stock update from Stock Management')
      toast.success(`${newRow.productName} stock updated to ${newRow.stock}`)
    }
    fetchStock()

    return newRow
  }

  const columns = [
    { flex: 0.1, field: 'sku', minWidth: 120, headerName: 'SKU' },
    { flex: 0.3, field: 'productName', minWidth: 260, headerName: 'Product' },
    {
      flex: 0.15,
      field: 'stock',
      minWidth: 130,
      type: 'number',
      editable: true,
      headerName: 'Stock (editable)',
      renderCell: ({ row }) => (
        <CustomChip size='small' skin='light' color={stockColor(row.stock)} label={`${row.stock} units`} />
      )
    },
    {
      flex: 0.1,
      field: 'reorderLevel',
      minWidth: 120,
      headerName: 'Reorder Level',
      renderCell: ({ row }) => <Typography variant='body2'>{row.reorderLevel}</Typography>
    }
  ]

  return (
    <Card>
      <CardHeader title='Stock Management' subheader='Double-click the Stock cell to adjust quantity inline' />
      <Box sx={{ height: 560 }}>
        <DataGrid
          getRowId={row => row.productId}
          rows={rows}
          columns={columns}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={() => toast.error('Failed to update stock')}
        />
      </Box>
    </Card>
  )
}

export default StockManagement
