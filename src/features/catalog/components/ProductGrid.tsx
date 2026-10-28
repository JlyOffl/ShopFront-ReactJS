import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import type { Product } from '../model';

export interface ProductGridProps {
  products: readonly Product[];
  renderItem: (product: Product) => ReactNode;
}

export const ProductGrid = ({ products, renderItem }: ProductGridProps) => (
  <Box
    component="ul"
    aria-label="Products"
    sx={{
      listStyle: 'none',
      p: 0,
      m: 0,
      display: 'grid',
      gap: 2,
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    }}
  >
    {products.map((product) => (
      <li key={product.id}>{renderItem(product)}</li>
    ))}
  </Box>
);
