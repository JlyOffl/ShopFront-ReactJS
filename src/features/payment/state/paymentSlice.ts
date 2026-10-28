import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { countryChanged } from '@/features/region';

export interface PaymentState {
  /** null = the user has not chosen; the domain decides the default. */
  selectedProvider: string | null;
  agreeToDonate: boolean;
}

const initialState: PaymentState = { selectedProvider: null, agreeToDonate: false };

export const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    paymentMethodSelected(state, action: PayloadAction<string>) {
      state.selectedProvider = action.payload;
    },
    donationToggled(state) {
      state.agreeToDonate = !state.agreeToDonate;
    },
    paymentReset() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(countryChanged, () => initialState);
  },
  selectors: {
    selectSelectedProvider: (state) => state.selectedProvider,
    selectAgreeToDonate: (state) => state.agreeToDonate,
  },
});

export const { paymentMethodSelected, donationToggled, paymentReset } = paymentSlice.actions;
export const { selectSelectedProvider, selectAgreeToDonate } = paymentSlice.selectors;
