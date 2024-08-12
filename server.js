const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// MongoDB connect
mongoose.connect('mongodb://localhost:27017/signup', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const orderSchema = new mongoose.Schema({
    user: {
        name: String,
        email: String,
        phone: String,
        address: String
    },
    orderItems: [{
        name: String,
        price: Number,
        quantity: Number,
        total: Number
    }],
    totalPrice: Number
});

// User model
const User = mongoose.model('User', userSchema);
// Order model
const Order = mongoose.model('Order', orderSchema);

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirm-order.html'));
});

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            res.json({ success: false, message: 'Username not valid' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.json({ success: false, message: 'Invalid password' });
            return;
        }

        res.json({ success: true });
        
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});


app.post('/confirm-order', async (req, res) => {
    const { name, email, phone, address, orderItems, totalPrice } = req.body;

    try {
        const newOrder = new Order({
            user: {
                name,
                email,
                phone,
                address
            },
            orderItems,
            totalPrice
        });

        await newOrder.save();

        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
