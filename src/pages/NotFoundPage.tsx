import { Button } from '@mui/material';
import { Link } from 'react-router';
import { EmptyState } from '@/shared/ui';

export const NotFoundPage = () => (
  <EmptyState
    title="Page not found"
    description="The page you are looking for does not exist."
    action={
      <Button component={Link} to="/" variant="contained">
        Go to catalog
      </Button>
    }
  />
);
