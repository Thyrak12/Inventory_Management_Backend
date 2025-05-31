import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('✅ MongoDB connected successfully');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// Define schema and model
    const productSchema = new mongoose.Schema({
        name: { type: String, required: true },
        sku: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    });

    const Product = mongoose.model('Product', productSchema);

    // Create and save document
    const pen = new Product({
        name: 'Pen',
        sku: 'PEN001',
        category: 'Stationery',
        price: 1.50,
        quantity: 100
    });

    pen.save()
        .then(doc => {
            console.log('✅ Product saved:', doc);
            mongoose.connection.close(); // optional: close connection after saving
        })
        .catch(err => {
            console.error('❌ Save error:', err);
            mongoose.connection.close();
        });
