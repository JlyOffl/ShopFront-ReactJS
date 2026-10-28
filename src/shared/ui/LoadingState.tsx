import { Box, CircularProgress, Typography } from '@mui/material';

export interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = 'Loading…' }: LoadingStateProps) => (
  <Box role="status" aria-live="polite" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 3 }}>
    <CircularProgress size={20} />
    <Typography color="text.secondary">{label}</Typography>
  </Box>
);
