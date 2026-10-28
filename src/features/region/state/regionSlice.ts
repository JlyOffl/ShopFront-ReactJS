import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_COUNTRY, type CountryCode } from '@/shared/domain';

export interface RegionState {
  countryCode: CountryCode;
}

const initialState: RegionState = { countryCode: DEFAULT_COUNTRY };

export const regionSlice = createSlice({
  name: 'region',
  initialState,
  reducers: {
    countryChanged(state, action: PayloadAction<CountryCode>) {
      state.countryCode = action.payload;
    },
  },
  selectors: {
    selectCountryCode: (state) => state.countryCode,
  },
});

export const { countryChanged } = regionSlice.actions;
export const { selectCountryCode } = regionSlice.selectors;
