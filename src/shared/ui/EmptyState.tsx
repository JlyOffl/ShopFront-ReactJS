import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <Box
    sx={{
      textAlign: 'center',
      py: 8,
      px: 2,
      border: 1,
      borderColor: 'divider',
      borderStyle: 'dashed',
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" component="p" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography color="text.secondary" sx={{ mb: action ? 2 : 0 }}>
        {description}
      </Typography>
    )}
    {action}
  </Box>
);
