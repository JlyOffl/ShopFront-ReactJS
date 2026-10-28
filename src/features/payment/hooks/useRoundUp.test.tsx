import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderHookWithProviders } from '@/test/render';
import { countryPaymentFor } from '../model';
import { useRoundUp } from './useRoundUp';

describe('useRoundUp', () => {
  it('adds the tip to the total only after the customer agrees', () => {
    const { result } = renderHookWithProviders(() => useRoundUp(19.8, countryPaymentFor('AU')));

    expect(result.current).toMatchObject({ total: 19.8, tip: 0.2, agreeToDonate: false });

    act(() => result.current.updateAgreeToDonate());

    expect(result.current).toMatchObject({ total: 20, tip: 0.2, agreeToDonate: true });
  });

  it('delegates to the injected strategy (JP rounds to the nearest hundred)', () => {
    const { result } = renderHookWithProviders(() => useRoundUp(3312, countryPaymentFor('JP')));

    act(() => result.current.updateAgreeToDonate());

    expect(result.current).toMatchObject({ total: 3400, tip: 88 });
  });
});
