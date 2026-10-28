import { Alert, AlertTitle, Box, Button } from '@mui/material';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

/** Last line of defence: any render/loader error inside the route tree lands here. */
export const RouteErrorPage = () => {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Unexpected error';

  if (import.meta.env.DEV) console.error(error);

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', my: 8, px: 2 }}>
      <Alert severity="error">
        <AlertTitle>Something went wrong</AlertTitle>
        {message}
      </Alert>
      <Button component={Link} to="/" sx={{ mt: 2 }}>
        Back to catalog
      </Button>
    </Box>
  );
};
