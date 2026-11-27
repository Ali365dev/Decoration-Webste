/**
 * Export rows to a CSV file and trigger browser download.
 *
 * @param {string} filename - e.g. 'orders-2026-11-10.csv'
 * @param {Object[]} rows
 * @param {{ label: string, value: (row: Object) => string|number }[]} columns
 */
const exportToCSV = (filename, rows, columns) => {
  const escape = val => {
    const str = val == null ? '' : String(val)
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const header = columns.map(c => escape(c.label)).join(',')
  const lines = rows.map(row => columns.map(c => escape(c.value(row))).join(','))

  // UTF-8 BOM so Excel opens accented/Urdu text correctly
  const csv = '﻿' + [header, ...lines].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default exportToCSV
