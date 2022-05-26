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

const enum productCategory {
  V = 'V - Fuses',
  UR_NH = 'UR - Ultra Rapid / NH - Low Voltage',
  HH = "HH - High Voltage",
  NH = "NH - Low Voltage",
  UR = "UR - Ultra Rapid",
  D = "D - European Standard",
  G = "G - Miniature",
}
