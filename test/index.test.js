// ! Dont change this code
const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const cartData = require("../src/data/cart.js");

// @ Write your code here

// Asyncronous Testing
// https://jestjs.io/docs/asynchronous

describe("Product API Testing", () => {
  test("should return product data with id 1", async () => {
    const productId = 1;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
  });
  test("should check products.length with limit", async () => {
    const productsLimit = 30;
    const productData = await fetchProductsData();
    expect(productData.products.length).toBeGreaterThanOrEqual(productsLimit);
  });

  test("should return product data with id 9", async () => {
    const productId = 9;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
    expect(productData.title).toEqual("Infinix INBOOK"); // Correct the expected title
  });

  // Add a new test case with a different product id
  test("should return product data with id 15", async () => {
    const productId = 15;
    const productData = await fetchProductsData(productId);
    expect(productData.id).toBe(productId);
  });
});
// Mocking
// https://jestjs.io/docs/mock-functions

const { fetchCartsData } = require('../src/dataService');

jest.mock('../src/dataservice', () => {
  const originalModule = jest.requireActual('../src/dataservice');
  return {
    ...originalModule,
    __esModule: true,
    fetchCartsData: jest.fn(),
  };
});

describe('Cart API Testing', () => {
  test('should compare total cart items with length of fetched data', async () => {
    fetchCartsData.mockResolvedValue(cartData.carts);
    const cartsData = await fetchCartsData();
    const totalItems = cartsData.length;
    const expectedTotal = cartData.total;
    expect(totalItems).toBe(expectedTotal);
  });

  test('should compare total length of carts data with total', async () => {
    fetchCartsData.mockResolvedValue([
      { id: 1, productId: 1, quantity: 1 },
      { id: 2, productId: 2, quantity: 2 },
      { id: 3, productId: 3, quantity: 3 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(6);
  });

  // Add a new test case with different cart data
  test('should compare total length of carts data with total - variation', async () => {
    fetchCartsData.mockResolvedValue([
      { id: 4, productId: 4, quantity: 4 },
      { id: 5, productId: 5, quantity: 5 },
    ]);
    const cartsData = await fetchCartsData();
    const totalLength = cartsData.reduce((acc, cart) => acc + cart.quantity, 0);
    expect(totalLength).toBe(9);
  });
}); 

// Setup & Teardown
// https://jestjs.io/docs/setup-teardown

let productData;

beforeAll(async () => {
  productData = await fetchProductsData();
});

describe("Product Utility Testing", () => {
  describe("convertToRupiah", () => {
    // ... (other test cases)

    test('should convert 2000 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(2000);
      expect(priceInRupiah).toMatch(/Rp\s30\.872\.000,\d{2}/); // Update the expected pattern
    });

    test('should convert 1200 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(1200);
      expect(priceInRupiah).toMatch(/Rp\s18\.523\.200,\d{2}/); // Update the expected pattern
    });


    // Add a new test case with a different amount
    test('should convert 750 dollars into rupiah', () => {
      const priceInRupiah = convertToRupiah(750);
      expect(priceInRupiah).toMatch(/Rp\s11\.577\.000,\d{2}/);
    });
  });
  describe("countDiscount", () => {
    test("it should calculate discounted price correctly", () => {
      const price = 2000;
      const discount = 20; // Change the discount to 20
      const result = countDiscount(price, discount);
      expect(result).toEqual(1600);
    });

    test("it should handle zero discount", () => {
      const price = 3000; // Change the price to 3000
      const discount = 0;
      const result = countDiscount(price, discount);
      expect(result).toEqual(3000);
    });

    // Add a new test case with a different discount
    test("it should handle 30% discount", () => {
      const price = 1500;
      const discount = 30;
      const result = countDiscount(price, discount);
      expect(result).toEqual(1050);
    });
  });

  describe("setProductsCards", () => {
    test("it should return an array of products with specific keys", () => {
      const productsCards = setProductsCards(productData.products);
      const firstProductKeys = Object.keys(productsCards[0]);
      const expectedKeys = ["price", "after_discount", "image"];
      expect(firstProductKeys).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
