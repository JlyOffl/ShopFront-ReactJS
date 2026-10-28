import { Alert, Button } from '@mui/material';

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <Alert
    severity="error"
    sx={{ my: 2 }}
    action={
      onRetry ? (
        <Button color="inherit" size="small" onClick={onRetry}>
          Retry
        </Button>
      ) : undefined
    }
  >
    {message}
  </Alert>
);
