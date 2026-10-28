import { Card, CardContent, Divider, Typography } from '@mui/material';
import { ErrorState, LoadingState } from '@/shared/ui';
import { DonationCheckbox } from './components/DonationCheckbox';
import { PayButton } from './components/PayButton';
import { PaymentMethods } from './components/PaymentMethods';
import { useCountryPayment } from './hooks/useCountryPayment';
import { usePaymentMethods } from './hooks/usePaymentMethods';
import { useRoundUp } from './hooks/useRoundUp';
import { formatButtonLabel, formatCheckboxLabel, type PaymentResult } from './model';

export interface PaymentProps {
  amount: number;
  onPay: (result: PaymentResult) => void;
  isPaying?: boolean;
  disabled?: boolean;
}

/**
 * Feature container — the article's final `Payment`.
 * It reads like a humble piece of HTML: hooks supply state, the domain
 * supplies labels and numbers, and the sub-components only render.
 */
export const Payment = ({ amount, onPay, isPaying = false, disabled = false }: PaymentProps) => {
  const { countryCode, strategy } = useCountryPayment();
  const { paymentMethods, selectedProvider, selectPaymentMethod, isLoading, errorMessage, retry } =
    usePaymentMethods(countryCode);
  const { total, tip, agreeToDonate, updateAgreeToDonate } = useRoundUp(amount, strategy);

  return (
    <Card variant="outlined" component="section" aria-labelledby="payment-heading">
      <CardContent>
        <Typography id="payment-heading" variant="h6" component="h2" gutterBottom>
          Payment
        </Typography>

        {isLoading && <LoadingState label="Loading payment options…" />}
        {errorMessage && <ErrorState message={errorMessage} onRetry={retry} />}
        {!isLoading && !errorMessage && (
          <PaymentMethods options={paymentMethods} selected={selectedProvider} onSelect={selectPaymentMethod} />
        )}

        <Divider sx={{ my: 1 }} />

        <DonationCheckbox
          onChange={updateAgreeToDonate}
          checked={agreeToDonate}
          content={formatCheckboxLabel(agreeToDonate, tip, strategy)}
        />

        <PayButton
          label={formatButtonLabel(strategy, total)}
          loading={isPaying}
          disabled={disabled || isLoading}
          onClick={() => onPay({ provider: selectedProvider, donation: agreeToDonate ? tip : 0, total })}
        />
      </CardContent>
    </Card>
  );
};
