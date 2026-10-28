import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Avatar, Box, Button, Card, CardActions, CardContent, Chip, Rating, Typography } from '@mui/material';
import type { Product } from '../model';

export interface ProductCardProps {
  product: Product;
  priceLabel: string;
  quantityInCart: number;
  canAdd: boolean;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, priceLabel, quantityInCart, canAdd, onAdd }: ProductCardProps) => (
  <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }} aria-hidden>
          {product.initials}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" component="h2" fontWeight={600} noWrap>
            {product.name}
          </Typography>
          <Chip label={product.category} size="small" variant="outlined" />
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {product.description}
      </Typography>
      <Rating value={product.rating} precision={0.5} readOnly size="small" aria-label={`Rated ${product.rating}`} />
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
      <Typography variant="h6" component="p">
        {priceLabel}
      </Typography>
      <Button
        variant={quantityInCart > 0 ? 'outlined' : 'contained'}
        startIcon={<AddShoppingCartIcon />}
        disabled={!product.isAvailable || !canAdd}
        onClick={() => onAdd(product)}
        aria-label={`Add ${product.name} to cart`}
      >
        {!product.isAvailable ? 'Sold out' : quantityInCart > 0 ? `In cart (${quantityInCart})` : 'Add'}
      </Button>
    </CardActions>
  </Card>
);
