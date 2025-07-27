import db from './models/index.js';
import { faker } from '@faker-js/faker';

async function seed() {
  try {
    // Drop and recreate tables (DEV ONLY)
    await db.sequelize.sync({ force: true });
    console.log('Database synced.');

    // Seed Users (50)
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await db.User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: 'password123', // hash in real apps
        role: faker.helpers.arrayElement(['admin', 'staff']),
      });
      users.push(user);
    }

    // Seed Products (50)
    const products = [];
    for (let i = 0; i < 50; i++) {
      const product = await db.Product.create({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category: faker.helpers.arrayElement(['Shirt', 'Shoe', 'Pant']),
      });
      products.push(product);
    }

    // Seed ProductVariants (100) - assign to random products
    const variants = [];
    for (let i = 0; i < 100; i++) {
      const product = products[faker.number.int({ min: 0, max: products.length - 1 })];
      const variant = await db.ProductVariant.create({
        color: faker.color.human(),
        size: faker.helpers.arrayElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
        price: faker.commerce.price(5, 500, 2),
        stock: faker.number.int({ min: 0, max: 100 }),
        product_id: product.id, // foreign key exactly as in your model
      });
      variants.push(variant);
    }

    // Seed Sales (30) - assign to random users
    const sales = [];
    for (let i = 0; i < 30; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const sale = await db.Sales.create({
        user_id: user.id,
        status: faker.helpers.arrayElement(['pending', 'completed', 'cancelled']),
        total_price: 0, // will calculate later
      });
      sales.push(sale);
    }

    // Seed SalesRecords (100) - assign to random sales & variants
    const saleTotals = {}; // { sale_id: total_price }
    for (let i = 0; i < 100; i++) {
      const sale = sales[faker.number.int({ min: 0, max: sales.length - 1 })];
      const variant = variants[faker.number.int({ min: 0, max: variants.length - 1 })];
      const qty = faker.number.int({ min: 1, max: 10 });
      const price_each = variant.price;

      await db.SalesRecord.create({
        sales_id: sale.id,
        product_variant_id: variant.id,
        qty,
        price_each,
      });

      saleTotals[sale.id] = (saleTotals[sale.id] || 0) + qty * parseFloat(price_each);
    }

    // Update sales total_price with calculated sums
    for (const sale of sales) {
      sale.total_price = saleTotals[sale.id]?.toFixed(2) || 0;
      await sale.save();
    }

    // Seed StockTransactions (100) - assign to random users & variants
    for (let i = 0; i < 100; i++) {
      const user = users[faker.number.int({ min: 0, max: users.length - 1 })];
      const variant = variants[faker.number.int({ min: 0, max: variants.length - 1 })];

      await db.StockTransaction.create({
        user_id: user.id,
        product_variant_id: variant.id,
        qty: faker.number.int({ min: 1, max: 50 }).toString(), // model expects string
        type: faker.helpers.arrayElement(['in', 'out']),
      });
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
