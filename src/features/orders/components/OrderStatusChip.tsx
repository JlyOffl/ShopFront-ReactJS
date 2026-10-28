import { Chip, type ChipProps } from '@mui/material';
import type { OrderStatus } from '../model';

// Colour is a presentation concern, so this mapping stays in the view layer.
const COLOURS: Record<OrderStatus, ChipProps['color']> = {
  PENDING: 'warning',
  PAID: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'default',
};

export interface OrderStatusChipProps {
  status: OrderStatus;
  label: string;
}

export const OrderStatusChip = ({ status, label }: OrderStatusChipProps) => (
  <Chip size="small" label={label} color={COLOURS[status]} variant={status === 'CANCELLED' ? 'outlined' : 'filled'} />
);
