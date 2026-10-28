import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { Order } from '../model';
import { OrderStatusChip } from './OrderStatusChip';

export interface OrderDetailsProps {
  order: Order;
  formatMoney: (amount: number) => string;
  formatDate: (date: Date) => string;
  onCancel: () => void;
  isCancelling: boolean;
}

const Row = ({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
    <Typography fontWeight={strong ? 700 : 400}>{label}</Typography>
    <Typography fontWeight={strong ? 700 : 400}>{value}</Typography>
  </Box>
);

export const OrderDetails = ({ order, formatMoney, formatDate, onCancel, isCancelling }: OrderDetailsProps) => (
  <Card variant="outlined">
    <CardContent>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="h2">
            Order {order.reference}
          </Typography>
          <Typography color="text.secondary">
            Placed {formatDate(order.placedAt)} · paid with {order.paymentProvider}
          </Typography>
        </Box>
        <OrderStatusChip status={order.status} label={order.statusLabel} />
      </Stack>

      <List dense disablePadding aria-label="Order items">
        {order.lines.map((line) => (
          <ListItem key={line.productId} disableGutters secondaryAction={formatMoney(line.unitPrice * line.quantity)}>
            <ListItemText primary={line.name} secondary={`${line.quantity} × ${formatMoney(line.unitPrice)}`} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
      <Row label="Subtotal" value={formatMoney(order.subtotal)} />
      {order.hasDonation && <Row label="Charity donation" value={formatMoney(order.donation)} />}
      <Row label="Total" value={formatMoney(order.total)} strong />

      {order.isCancellable && (
        <Button color="error" variant="outlined" sx={{ mt: 2 }} onClick={onCancel} disabled={isCancelling}>
          {isCancelling ? 'Cancelling…' : 'Cancel order'}
        </Button>
      )}
    </CardContent>
  </Card>
);
