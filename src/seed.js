import db from './models/index.js';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database synced.');

    // Create 50 users
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await db.User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123', // hash in real app
        role: faker.helpers.arrayElement(['admin', 'staff']),
      });
      users.push(user);
    }

    // Create 50 products
    const products = [];
    for (let i = 0; i < 50; i++) {
      const product = await db.Product.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.commerce.department(),
      });
      products.push(product);
    }

    // Create 100 product variants (2 per product approx)
    const variants = [];
    for (let i = 0; i < 100; i++) {
      const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
      const variant = await db.ProductVariant.create({
        color: faker.color.human(),
        size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        price: faker.commerce.price(5, 500, 2),
        stock: faker.number.int({ min: 0, max: 100 }),
        productId: product.id, // adjust if association field different
      });
      variants.push(variant);
    }

    // Create 30 sales
    const sales = [];
    for (let i = 0; i < 30; i++) {
      const sale = await db.Sales.create({
        status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
        total_price: 0, // will calculate later
      });
      sales.push(sale);
    }

    // Create 100 sales records
    let totalPrices = {}; // Map saleId -> total price accumulator

    for (let i = 0; i < 100; i++) {
      const sale = sales[faker.number.int({ min: 0, max: sales.length - 1 })];
      const variant = variants[faker.number.int({ min: 0, max: variants.length - 1 })];
      const qty = faker.number.int({ min: 1, max: 10 });
      const price_each = variant.price;

      await db.SalesRecord.create({
        qty,
        price_each,
        salesId: sale.id, // adjust field if needed
        productVariantId: variant.id, // adjust if needed
      });

      totalPrices[sale.id] = (totalPrices[sale.id] || 0) + qty * parseFloat(price_each);
    }

    // Update total_price for each sale
    for (const [saleId, total] of Object.entries(totalPrices)) {
      const sale = sales.find(s => s.id === parseInt(saleId));
      if (sale) {
        sale.total_price = total.toFixed(2);
        await sale.save();
      }
    }

    // Create 100 stock transactions
    for (let i = 0; i < 100; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const variant = variants[faker.number.int({ min: 0, max: variants.length - 1 })];
      await db.StockTransaction.create({
        qty: faker.number.int({ min: 1, max: 50 }).toString(),
        type: faker.helpers.arrayElement(['in', 'out']),
        userId: user.id, // adjust field name
        productVariantId: variant.id, // adjust field name
      });
    }

    console.log('Seeding complete.');
    process.exit(0);

  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
