import type { CountryCode } from '@/shared/domain';

export const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderLineData {
  readonly productId: string;
  readonly name: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

export interface OrderData {
  readonly id: string;
  readonly createdAt: string;
  readonly countryCode: CountryCode;
  readonly status: OrderStatus;
  readonly lines: readonly OrderLineData[];
  readonly paymentProvider: string;
  readonly subtotal: number;
  readonly donation: number;
  readonly total: number;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

const CANCELLABLE: ReadonlySet<OrderStatus> = new Set(['PENDING', 'PAID']);

export class Order {
  private readonly data: OrderData;

  public constructor(data: OrderData) {
    this.data = data;
  }

  get id(): string {
    return this.data.id;
  }

  /** Short, human friendly reference shown in the UI. */
  get reference(): string {
    return `#${this.data.id.slice(-6).toUpperCase()}`;
  }

  get countryCode(): CountryCode {
    return this.data.countryCode;
  }

  get status(): OrderStatus {
    return this.data.status;
  }

  get statusLabel(): string {
    return STATUS_LABELS[this.data.status];
  }

  get placedAt(): Date {
    return new Date(this.data.createdAt);
  }

  get lines(): readonly OrderLineData[] {
    return this.data.lines;
  }

  get itemCount(): number {
    return this.data.lines.reduce((count, line) => count + line.quantity, 0);
  }

  get paymentProvider(): string {
    return this.data.paymentProvider;
  }

  get subtotal(): number {
    return this.data.subtotal;
  }

  get donation(): number {
    return this.data.donation;
  }

  get hasDonation(): boolean {
    return this.data.donation > 0;
  }

  get total(): number {
    return this.data.total;
  }

  get isCancellable(): boolean {
    return CANCELLABLE.has(this.data.status);
  }
}

export const toOrders = (data: readonly OrderData[]): Order[] =>
  data.map((item) => new Order(item)).sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
