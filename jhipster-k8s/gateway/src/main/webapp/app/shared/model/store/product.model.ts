export interface IProduct {
  id?: number;
  title?: string;
  price?: number;
  imageContentType?: string | null;
  image?: string | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public title?: string,
    public price?: number,
    public imageContentType?: string | null,
    public image?: string | null
  ) {}
}
