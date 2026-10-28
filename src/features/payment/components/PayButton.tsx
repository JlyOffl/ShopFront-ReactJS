import { Button, CircularProgress } from '@mui/material';

export interface PayButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const PayButton = ({ label, onClick, loading = false, disabled = false }: PayButtonProps) => (
  <Button
    variant="contained"
    size="large"
    fullWidth
    onClick={onClick}
    disabled={disabled || loading}
    startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
    sx={{ mt: 2 }}
  >
    {loading ? 'Processing…' : label}
  </Button>
);
