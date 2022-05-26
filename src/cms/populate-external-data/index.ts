import type { CMSFilters } from '../../types/CMSFilters';
import type { Product, productCategory } from './types';
var Airtable = require('airtable');

/**
 * Populate CMS Data from an external API.
 */
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  'cmsfilter',
  async (filtersInstances: CMSFilters[]) => {
    // Get the filters instance
    const [filtersInstance] = filtersInstances;

    // Get the list instance
    const { listInstance } = filtersInstance;

    // Save a copy of the template
    const [firstItem] = listInstance.items;
    const itemTemplateElement = firstItem.element;

    // Fetch external data
    const products = await fetchProducts();

    // Remove existing items
    listInstance.clearItems();

    const newItems = products.map((product) => {
      return createItem(product, itemTemplateElement)
    })
    // Populate the list

    await listInstance.addItems(newItems);

    // Get the template filter
    const filterTemplateElement = filtersInstance.form.querySelector<HTMLLabelElement>('[data-element="product category"]');
    if (!filterTemplateElement) return;

    // Get the parent wrapper
    const filtersWrapper = filterTemplateElement.parentElement;
    if (!filtersWrapper) return;

    // Remove the template from the DOM
    filterTemplateElement.remove();

    // Collect the categories
    const categories = collectCategories(products);

    // Create the new filters and append the to the parent wrapper
    for (const category of categories) {
      const newFilter = createFilter(category, filterTemplateElement);
      if (!newFilter) continue;

      filtersWrapper.append(newFilter);
    }

    // Sync the CMSFilters instance with the new created filters
    filtersInstance.storeFiltersData();
  },
]);

/**
 * Fetches fake products from Fake Store API.
 * @returns An array of {@link Product}.
 */
const fetchProducts = async () => {
  return new Promise((resolve, reject) => {
    var base = new Airtable({ apiKey: 'keyVaqaXzXRDSsa31' }).base('app6CABYWEh8dxlQd');
    let data: Product[] = [];

    base('Product Details').select({
      view: "Grid view"
    })
      .eachPage(function page(records: any[], fetchNextPage: any) {
        try {
          records.forEach(function (record: any) {
            
            let image = ""
            try {
              image = record.get('Product Image')[0].url
            } catch(error) {

            }

            const item: Product = {
              partNumber: record?.get('Part Number')??" ",
              description: record?.get('Description')?? " ",
              productCategory: record?.get('Product Category')?? " ",
              productSegment: record?.get('Product Segment')?? " ",
              ampRating: record?.get('Amp Rating')?? " ",
              voltage: record?.get('Voltage')?? " ",
              characteristics: record?.get('Characteristics')?? " ",
              size: record?.get('Size')?? " ",
              individualDatasheet: record?.get('Individual Datasheet')?? " ",
              sectionDatasheet: record?.get('Section Datasheet')?? " ",
              image: image,
            };

            data.push(item);
          });
        } catch (e) { console.log('error inside eachPage => ', e) }
        fetchNextPage();
      }, function done(err: any) {
        if (err) {
          console.error(err);
          reject(err)
        }
        resolve(data)
      })
  })
};
 
/**
 * Creates an item from the template element.
 * @param product The product data to create the item from.
 * @param templateElement The template element.
 *
 * @returns A new Collection Item element.
 */
const createItem = (product: Product, templateElement: HTMLDivElement) => {

  // Clone the template element
  const newItem = templateElement.cloneNode(true) as HTMLDivElement;

  // Query inner elements
  const image = newItem.querySelector<HTMLImageElement>('[data-element="image"]');
  const sectionDatasheet = newItem.querySelector<HTMLAnchorElement>('[data-element="section datasheet"]');
  const individualDatasheet = newItem.querySelector<HTMLAnchorElement>('[data-element="individual datasheet"]');
  const partNumber = newItem.querySelector<HTMLDivElement>('[data-element="part number"]');
  const productCategory = newItem.querySelector<HTMLDivElement>('[data-element="category"]');
  const productSegment = newItem.querySelector<HTMLDivElement>('[data-element="segment"]');
  const description = newItem.querySelector<HTMLParagraphElement>('[data-element="description"]');
  const ampRating = newItem.querySelector<HTMLParagraphElement>('[data-element="amp rating"]');
  const voltage = newItem.querySelector<HTMLParagraphElement>('[data-element="voltage"]');
  const characteristics = newItem.querySelector<HTMLParagraphElement>('[data-element="characteristics"]');
  const size = newItem.querySelector<HTMLParagraphElement>('[data-element="size"]');

  // Populate inner elements
  if (image) image.src = product.image;
  if (individualDatasheet) individualDatasheet.href = product.individualDatasheet;
  if (sectionDatasheet) sectionDatasheet.href = product.sectionDatasheet;
  if (partNumber) partNumber.textContent = product.partNumber;
  if (productCategory) productCategory.textContent = product.productCategory;
  if (productSegment) productSegment.textContent = product.productSegment;
  if (description) description.textContent = product.description;
  if (ampRating) ampRating.textContent = product.ampRating;
  if (voltage) voltage.textContent = product.voltage;
  if (characteristics) characteristics.textContent = product.characteristics;
  if (size) size.textContent = product.size;

  return newItem;
};

/**
 * Collects all the categories from the products' data.
 * @param products The products' data.
 *
 * @returns An array of {@link Product} categories.
 */
const collectCategories = (products: Product[]) => {
  const categories: Set<Product['productCategory']> = new Set();

  for (const { productCategory } of products) {
    categories.add(productCategory);
  }

  return [...categories];
};

/**
 * Creates a new radio filter from the template element.
 * @param category The filter value.
 * @param templateElement The template element.
 *
 * @returns A new category radio filter.
 */
const createFilter = (category: Product['productCategory'], templateElement: HTMLLabelElement) => {
  // Clone the template element
  const newFilter = templateElement.cloneNode(true) as HTMLLabelElement;

  // Query inner elements
  const label = newFilter.querySelector('span');
  const radio = newFilter.querySelector('input');

  if (!label || !radio) return;

  // Populate inner elements
  label.textContent = category;
  radio.value = category;

  return newFilter;
};

