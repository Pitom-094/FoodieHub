const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Food = require('./server/models/Food');
const User = require('./server/models/User');

const envPath = path.resolve(__dirname, 'server', '.env');
dotenv.config({ path: envPath });

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const foodCount = await Food.countDocuments();
        const userCount = await User.countDocuments();
        const adminUser = await User.findOne({ role: 'admin' });

        console.log('--- DATABASE STATUS ---');
        console.log('Food Items:', foodCount);
        console.log('Users:', userCount);
        console.log('Admin Found:', adminUser ? 'YES' : 'NO');

        if (foodCount > 0 && adminUser) {
            console.log('RESULT: SUCCESS');
        } else {
            console.log('RESULT: INCOMPLETE');
        }
        process.exit(0);
    })
    .catch(err => {
        console.error('DATABASE ERROR:', err.message);
        process.exit(1);
    });
