import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { Order } from '../model';
import { OrderStatusChip } from './OrderStatusChip';

export interface OrdersTableProps {
  orders: readonly Order[];
  formatAmount: (order: Order, amount: number) => string;
  formatDate: (date: Date) => string;
  onSelect: (order: Order) => void;
}

export const OrdersTable = ({ orders, formatAmount, formatDate, onSelect }: OrdersTableProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table aria-label="Orders">
      <TableHead>
        <TableRow>
          <TableCell>Order</TableCell>
          <TableCell>Placed</TableCell>
          <TableCell>Market</TableCell>
          <TableCell align="right">Items</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            hover
            tabIndex={0}
            onClick={() => onSelect(order)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') onSelect(order);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <TableCell>
              <Typography fontWeight={600}>{order.reference}</Typography>
            </TableCell>
            <TableCell>{formatDate(order.placedAt)}</TableCell>
            <TableCell>{order.countryCode}</TableCell>
            <TableCell align="right">{order.itemCount}</TableCell>
            <TableCell align="right">{formatAmount(order, order.total)}</TableCell>
            <TableCell>
              <OrderStatusChip status={order.status} label={order.statusLabel} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
