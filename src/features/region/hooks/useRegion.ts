import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { COUNTRIES, countryByCode, type CountryCode } from '@/shared/domain';
import { countryChanged, selectCountryCode } from '../state/regionSlice';

export const useCountryCode = (): CountryCode => useAppSelector(selectCountryCode);

export const useRegion = () => {
  const dispatch = useAppDispatch();
  const countryCode = useCountryCode();

  const changeCountry = useCallback((code: CountryCode) => dispatch(countryChanged(code)), [dispatch]);

  return {
    countryCode,
    country: countryByCode(countryCode),
    countries: COUNTRIES,
    changeCountry,
  };
};
