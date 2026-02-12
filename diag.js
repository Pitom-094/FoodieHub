const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

console.log('--- Diagnostic Start ---');
const envPath = path.resolve(__dirname, 'server', '.env');
console.log('Checking .env at:', envPath);
dotenv.config({ path: envPath });

console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI is missing!');
    process.exit(1);
}

console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB connected!');
        process.exit(0);
    })
    .catch(err => {
        console.error('FAILURE: MongoDB connection error:', err.message);
        process.exit(1);
    });
