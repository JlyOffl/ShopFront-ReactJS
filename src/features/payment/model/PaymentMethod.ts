/** Shape the domain needs. The gateway's validated DTO is structurally compatible. */
export interface PaymentMethodData {
  readonly name: string;
  readonly displayName?: string | undefined;
}

export const CASH_PROVIDER = 'cash';

const capitalise = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Domain object: data + behaviour in one place, no UI knowledge.
 * Views ask it for `label` and `isDefaultMethod` instead of re-implementing
 * the `provider === 'cash'` check (the "logic leak" the article warns about).
 */
export class PaymentMethod {
  private readonly remotePaymentMethod: PaymentMethodData;

  public constructor(remotePaymentMethod: PaymentMethodData) {
    this.remotePaymentMethod = remotePaymentMethod;
  }

  get provider(): string {
    return this.remotePaymentMethod.name;
  }

  get label(): string {
    if (this.provider === CASH_PROVIDER) {
      return `Pay in ${this.provider}`;
    }
    return `Pay with ${this.remotePaymentMethod.displayName ?? capitalise(this.provider)}`;
  }

  get isDefaultMethod(): boolean {
    return this.provider === CASH_PROVIDER;
  }
}

export const payInCash = new PaymentMethod({ name: CASH_PROVIDER });

/**
 * No configured methods → show nothing (treated as cash).
 * Otherwise append the cash option to whatever the server returned.
 */
export const convertPaymentMethods = (methods: readonly PaymentMethodData[]): PaymentMethod[] => {
  if (methods.length === 0) {
    return [];
  }
  return [...methods.map((method) => new PaymentMethod(method)), payInCash];
};

/** The provider that should be selected when the user has not chosen one yet. */
export const resolveSelectedProvider = (
  options: readonly PaymentMethod[],
  userChoice: string | null,
): string => {
  if (userChoice && options.some((option) => option.provider === userChoice)) {
    return userChoice;
  }
  return options.find((option) => option.isDefaultMethod)?.provider ?? CASH_PROVIDER;
};
