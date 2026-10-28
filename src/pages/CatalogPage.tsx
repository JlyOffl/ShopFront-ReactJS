import { Button, LinearProgress } from '@mui/material';
import { Link } from 'react-router';
import { useCart } from '@/features/cart';
import { CatalogFilters, ProductCard, ProductGrid, useCatalog } from '@/features/catalog';
import { useMoneyFormatter } from '@/features/payment';
import { useRegion } from '@/features/region';
import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/shared/ui';

/** Pages are composition only: hooks in, humble components out. */
export const CatalogPage = () => {
  const { country } = useRegion();
  const catalog = useCatalog();
  const { cart, addItem } = useCart();
  const formatMoney = useMoneyFormatter();

  return (
    <>
      <PageHeader
        title="Catalog"
        subtitle={`${country.flag} Prices for ${country.name}`}
        actions={
          !cart.isEmpty && (
            <Button component={Link} to="/checkout" variant="contained">
              Checkout · {formatMoney(cart.subtotal)}
            </Button>
          )
        }
      />

      <CatalogFilters
        query={catalog.query}
        category={catalog.category}
        categories={catalog.categories}
        onQueryChange={catalog.setQuery}
        onCategoryChange={catalog.setCategory}
      />

      {catalog.isRefreshing && <LinearProgress sx={{ mb: 2 }} />}
      {catalog.isLoading && <LoadingState label="Loading products…" />}
      {catalog.errorMessage && <ErrorState message={catalog.errorMessage} onRetry={catalog.retry} />}

      {!catalog.isLoading && !catalog.errorMessage && catalog.products.length === 0 && (
        <EmptyState
          title="No products match"
          description={catalog.totalCount > 0 ? 'Try a different search or category.' : 'Nothing is on sale here yet.'}
        />
      )}

      <ProductGrid
        products={catalog.products}
        renderItem={(product) => (
          <ProductCard
            product={product}
            priceLabel={formatMoney(product.price)}
            quantityInCart={cart.quantityOf(product.id)}
            canAdd={cart.canAddMoreOf(product.id)}
            onAdd={addItem}
          />
        )}
      />
    </>
  );
};
