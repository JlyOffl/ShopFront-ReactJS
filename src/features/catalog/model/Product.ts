export interface ProductData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly inStock: boolean;
  readonly rating?: number | undefined;
}

export class Product {
  private readonly data: ProductData;

  public constructor(data: ProductData) {
    this.data = data;
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get description(): string {
    return this.data.description;
  }

  get category(): string {
    return this.data.category;
  }

  get price(): number {
    return this.data.price;
  }

  get isAvailable(): boolean {
    return this.data.inStock;
  }

  /** Fallback value instead of null checks sprinkled through the views. */
  get rating(): number {
    return this.data.rating ?? 0;
  }

  get initials(): string {
    return this.data.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }

  matches(query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return `${this.data.name} ${this.data.description} ${this.data.category}`.toLowerCase().includes(needle);
  }
}

export const ALL_CATEGORIES = 'all';

export interface ProductFilter {
  readonly query: string;
  readonly category: string;
}

export const filterProducts = (products: readonly Product[], filter: ProductFilter): Product[] =>
  products.filter(
    (product) =>
      (filter.category === ALL_CATEGORIES || product.category === filter.category) && product.matches(filter.query),
  );

export const categoriesOf = (products: readonly Product[]): string[] =>
  [...new Set(products.map((product) => product.category))].sort((a, b) => a.localeCompare(b));

export const toProducts = (data: readonly ProductData[]): Product[] => data.map((item) => new Product(item));
