import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { AppBar, Badge, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { Suspense } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useCart } from '@/features/cart';
import { CountrySelect, useRegion } from '@/features/region';
import { LoadingState } from '@/shared/ui';

const navButtonSx = {
  color: 'inherit',
  '&.active': { bgcolor: 'rgba(255,255,255,0.16)' },
} as const;

export const AppLayout = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { countryCode, countries, changeCountry } = useRegion();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1, flexWrap: 'wrap', py: { xs: 1, sm: 0 } }}>
          <Typography variant="h6" component="p" sx={{ fontWeight: 700, mr: 2 }}>
            Shopfront
          </Typography>
          <Box component="nav" aria-label="Main" sx={{ display: 'flex', gap: 0.5, flexGrow: 1 }}>
            <Button component={NavLink} to="/" end startIcon={<StorefrontIcon />} sx={navButtonSx}>
              Catalog
            </Button>
            <Button component={NavLink} to="/orders" startIcon={<ReceiptLongIcon />} sx={navButtonSx}>
              Orders
            </Button>
          </Box>
          <CountrySelect value={countryCode} countries={countries} onChange={changeCountry} />
          <IconButton color="inherit" aria-label={`Cart, ${cart.itemCount} items`} onClick={() => navigate('/checkout')}>
            <Badge badgeContent={cart.itemCount} color="secondary">
              <ShoppingCartOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Suspense fallback={<LoadingState label="Loading page…" />}>
          <Outlet />
        </Suspense>
      </Container>

      <Box component="footer" sx={{ py: 2, textAlign: 'center', color: 'text.secondary', fontSize: 13 }}>
        Layered React reference app · view → hooks → domain → gateway
      </Box>
    </Box>
  );
};
