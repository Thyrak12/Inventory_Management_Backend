// insertProducts.js
import mongoose from 'mongoose';
import connectDB from './config/db_connect.js';
import Product from './model/product.js';

const products = [
  { name: "Paracetamol 500mg Tablets", sku: "MED001", category: "Pain Relief", price: 3.99, quantity: 120 },
  { name: "Amoxicillin 250mg Capsules", sku: "MED002", category: "Antibiotic", price: 7.49, quantity: 75 },
  { name: "Cetirizine Hydrochloride 10mg", sku: "MED003", category: "Allergy", price: 5.25, quantity: 200 },
  { name: "Ibuprofen 200mg Tablets", sku: "MED004", category: "Pain Relief", price: 4.10, quantity: 150 },
  { name: "Omeprazole 20mg Capsules", sku: "MED005", category: "Digestive Health", price: 6.80, quantity: 90 },
  { name: "Insulin Glargine Injection", sku: "MED006", category: "Diabetes", price: 25.50, quantity: 40 },
  { name: "Salbutamol Inhaler", sku: "MED007", category: "Respiratory", price: 9.99, quantity: 60 },
  { name: "Metformin 500mg Tablets", sku: "MED008", category: "Diabetes", price: 8.30, quantity: 100 },
  { name: "Loratadine 10mg Tablets", sku: "MED009", category: "Allergy", price: 4.50, quantity: 180 },
  { name: "Aspirin 81mg Low Dose", sku: "MED010", category: "Cardiovascular", price: 3.75, quantity: 130 }
];

const insertData = async () => {
  await connectDB();

  try {
    await Product.insertMany(products);
    console.log('Products inserted successfully!');
  } catch (error) {
    console.error('Failed to insert products:', error);
  } finally {
    mongoose.disconnect();
  }
};

insertData();
