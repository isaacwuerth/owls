import { Card, styled, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material'

const KeyTableCell = styled(TableCell)({
  fontWeight: 'bold'
})

export interface InfoTableRow {
  label: string
  value: any
}

interface InfoTableProps {
  table: InfoTableRow[]
}

export function InfoTable ({ table }: InfoTableProps) {
  const rows = table.map((row) => (
    <TableRow key={row.label}>
      <KeyTableCell>{row.label}</KeyTableCell>
      <TableCell>{row.value}</TableCell>
    </TableRow>
  ))

  return (
    <TableContainer component={Card}>
      <Table>
        <TableBody>
          {rows}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
