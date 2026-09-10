const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const { connectDB } = require('./utils/connectDB');
const userRoutes = require('./routes/user.route');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectRedis } = require('./config/redisClient');


const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

connectDB();
connectRedis();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});