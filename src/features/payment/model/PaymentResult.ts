/** What the payment step hands back to whoever is placing the order. */
export interface PaymentResult {
  readonly provider: string;
  readonly donation: number;
  readonly total: number;
}
