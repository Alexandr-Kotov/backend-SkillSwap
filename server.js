const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const skillRoutes = require('./routes/skillRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/exchanges', require('./routes/exchangeRoutes'));
app.use('/api/skills', skillRoutes);
app.use('/', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
