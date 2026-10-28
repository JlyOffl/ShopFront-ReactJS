import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { MAX_QUANTITY_PER_LINE, type Cart } from '../model';

export interface CartTableProps {
  cart: Cart;
  formatMoney: (amount: number) => string;
  onQuantityChange: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const QUANTITIES = Array.from({ length: MAX_QUANTITY_PER_LINE }, (_, i) => i + 1);

export const CartTable = ({ cart, formatMoney, onQuantityChange, onRemove }: CartTableProps) => (
  <TableContainer component={Paper} variant="outlined">
    <Table aria-label="Shopping cart">
      <TableHead>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell align="right">Price</TableCell>
          <TableCell align="center">Qty</TableCell>
          <TableCell align="right">Total</TableCell>
          <TableCell padding="checkbox" />
        </TableRow>
      </TableHead>
      <TableBody>
        {cart.items.map((line) => (
          <TableRow key={line.productId}>
            <TableCell>{line.name}</TableCell>
            <TableCell align="right">{formatMoney(line.unitPrice)}</TableCell>
            <TableCell align="center">
              <TextField
                select
                size="small"
                value={line.quantity}
                onChange={(event) => onQuantityChange(line.productId, Number(event.target.value))}
                slotProps={{ htmlInput: { 'aria-label': `Quantity of ${line.name}` } }}
              >
                {QUANTITIES.map((quantity) => (
                  <MenuItem key={quantity} value={quantity}>
                    {quantity}
                  </MenuItem>
                ))}
              </TextField>
            </TableCell>
            <TableCell align="right">{formatMoney(cart.lineTotal(line))}</TableCell>
            <TableCell padding="checkbox">
              <IconButton aria-label={`Remove ${line.name}`} onClick={() => onRemove(line.productId)}>
                <DeleteOutlineIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>
            <Typography fontWeight={600}>Subtotal ({cart.itemCount} items)</Typography>
          </TableCell>
          <TableCell align="right">
            <Typography fontWeight={600}>{formatMoney(cart.subtotal)}</Typography>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableFooter>
    </Table>
  </TableContainer>
);
