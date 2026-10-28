import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import type { PaymentMethod } from '../model';

export interface PaymentMethodsProps {
  options: readonly PaymentMethod[];
  selected: string;
  onSelect: (provider: string) => void;
}

/** Pure component: given the same props it always renders the same output. */
export const PaymentMethods = ({ options, selected, onSelect }: PaymentMethodsProps) => {
  if (options.length === 0) return null;

  return (
    <FormControl component="fieldset" sx={{ my: 1 }}>
      <FormLabel component="legend">Payment method</FormLabel>
      <RadioGroup name="payment" value={selected} onChange={(_event, value) => onSelect(value)}>
        {options.map((method) => (
          <FormControlLabel key={method.provider} value={method.provider} control={<Radio />} label={method.label} />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
