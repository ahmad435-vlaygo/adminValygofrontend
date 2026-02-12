'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const tableHeaderSx = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 600,
  borderColor: 'rgba(255, 255, 255, 0.08)',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const tableCellSx = {
  color: 'rgba(255, 255, 255, 0.85)',
  borderColor: 'rgba(255, 255, 255, 0.06)',
  fontSize: '13px',
};

export function TableHeaderRow({ cells }: { cells: React.ReactNode[] }) {
  return (
    <TableRow sx={{ background: 'rgba(255, 255, 255, 0.04)' }}>
      {cells.map((cell, i) => (
        <TableCell key={i} sx={tableHeaderSx}>
          {cell}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function TableBodyRow({
  cells,
  onClick,
}: {
  cells: React.ReactNode[];
  onClick?: () => void;
}) {
  return (
    <TableRow
      onClick={onClick}
      sx={{
        borderColor: 'rgba(255, 255, 255, 0.06)',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': { background: onClick ? 'rgba(255, 255, 255, 0.04)' : 'transparent' },
      }}
    >
      {cells.map((cell, i) => (
        <TableCell key={i} sx={tableCellSx}>
          {cell}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function AdminTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <TableContainer>
      <Table size="medium">{children}</Table>
    </TableContainer>
  );
}

export function AdminTableEmpty({ colSpan, message = 'No data' }: { colSpan: number; message?: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', py: 4, fontSize: '14px' }}>
        {message}
      </TableCell>
    </TableRow>
  );
}
