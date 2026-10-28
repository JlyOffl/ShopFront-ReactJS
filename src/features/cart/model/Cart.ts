import { round2 } from '@/shared/domain';

/** Serializable line — this is what lives in the Redux store. */
export interface CartLine {
  readonly productId: string;
  readonly name: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

export interface CartItemInput {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export const MAX_QUANTITY_PER_LINE = 10;

export const clampQuantity = (quantity: number): number =>
  Math.min(Math.max(1, Math.trunc(Number.isFinite(quantity) ? quantity : 1)), MAX_QUANTITY_PER_LINE);

/**
 * Read-only domain view over the cart lines. Reducers stay dumb and
 * serializable; calculations live here and are unit tested in isolation.
 */
export class Cart {
  private readonly lines: readonly CartLine[];

  public constructor(lines: readonly CartLine[]) {
    this.lines = lines;
  }

  get items(): readonly CartLine[] {
    return this.lines;
  }

  get isEmpty(): boolean {
    return this.lines.length === 0;
  }

  get itemCount(): number {
    return this.lines.reduce((count, line) => count + line.quantity, 0);
  }

  get subtotal(): number {
    return round2(this.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0));
  }

  lineTotal(line: CartLine): number {
    return round2(line.unitPrice * line.quantity);
  }

  quantityOf(productId: string): number {
    return this.lines.find((line) => line.productId === productId)?.quantity ?? 0;
  }

  canAddMoreOf(productId: string): boolean {
    return this.quantityOf(productId) < MAX_QUANTITY_PER_LINE;
  }
}
