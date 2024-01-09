import { faker } from "@faker-js/faker";

export const generateProducts = () => {
  const products = [];

  for (let index = 0; index < 100 ; index++) {
    products.push({
        _id: faker.string.uuid(),
        code: faker.number.int({ min: 100, max: 1000 }),
        status: faker.datatype.boolean(),
        title: faker.commerce.productName(),
        description: faker.lorem.paragraph(),
        category: faker.commerce.productAdjective(),
        thumbnail: faker.image.url(),
        price: faker.commerce.price(),
        stock: faker.number.int({ min: 10000, max: 99999 }),
    });
  }

  return products;
};