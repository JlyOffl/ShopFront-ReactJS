import { MenuItem, TextField } from '@mui/material';
import { isCountryCode, type Country, type CountryCode } from '@/shared/domain';

export interface CountrySelectProps {
  value: CountryCode;
  countries: readonly Country[];
  onChange: (code: CountryCode) => void;
}

/** Humble view: no store access, just props in and events out. */
export const CountrySelect = ({ value, countries, onChange }: CountrySelectProps) => (
  <TextField
    select
    size="small"
    label="Market"
    value={value}
    onChange={(event) => {
      if (isCountryCode(event.target.value)) onChange(event.target.value);
    }}
    sx={{ minWidth: 170, '& .MuiInputBase-root': { bgcolor: 'background.paper' } }}
  >
    {countries.map((country) => (
      <MenuItem key={country.code} value={country.code}>
        {country.flag} {country.name}
      </MenuItem>
    ))}
  </TextField>
);
