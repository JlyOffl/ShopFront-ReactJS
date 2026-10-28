import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, MenuItem, TextField } from '@mui/material';
import { ALL_CATEGORIES } from '../model';

export interface CatalogFiltersProps {
  query: string;
  category: string;
  categories: readonly string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export const CatalogFilters = ({ query, category, categories, onQueryChange, onCategoryChange }: CatalogFiltersProps) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
    <TextField
      size="small"
      label="Search products"
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
      sx={{ flex: '1 1 260px' }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        },
      }}
    />
    <TextField
      select
      size="small"
      label="Category"
      value={category}
      onChange={(event) => onCategoryChange(event.target.value)}
      sx={{ flex: '0 1 200px' }}
    >
      <MenuItem value={ALL_CATEGORIES}>All categories</MenuItem>
      {categories.map((item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  </Box>
);
