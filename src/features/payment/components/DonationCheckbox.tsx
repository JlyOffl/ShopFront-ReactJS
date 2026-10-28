import { Checkbox, FormControlLabel } from '@mui/material';

export interface DonationCheckboxProps {
  onChange: () => void;
  checked: boolean;
  content: string;
}

export const DonationCheckbox = ({ onChange, checked, content }: DonationCheckboxProps) => (
  <FormControlLabel
    sx={{ display: 'flex', my: 1 }}
    control={<Checkbox checked={checked} onChange={onChange} />}
    label={content}
  />
);
