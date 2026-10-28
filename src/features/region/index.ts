// Public API of the region feature. Everything else is internal.
export { CountrySelect } from './components/CountrySelect';
export { useCountryCode, useRegion } from './hooks/useRegion';
export { countryChanged, regionSlice, selectCountryCode, type RegionState } from './state/regionSlice';
