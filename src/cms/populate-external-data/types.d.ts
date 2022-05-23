export interface Product {
  partNumber: string;
  description: string;
  productCategory: productCategory;
  productSegment: productSegment;
  image: string;
  ampRating: string;
  voltage: string;
  characteristics: string;
  size: string;
  individualDatasheet: string;
  sectionDatasheet: string;
}

const enum category {
  Electronics = 'electronics',
  Jewelery = 'jewelery',
  MenSClothing = "men's clothing",
  WomenSClothing = "women's clothing",
}
