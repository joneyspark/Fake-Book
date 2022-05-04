import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import postRoute from './routes/posts.js'
import userRoute from './routes/users.js'
const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors());
app.use('/posts', postRoute);
app.use('/users', userRoute);

// Mongo DB configuration

const CONNECTION_URL = process.env.CONNECTION_URL

const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`)))
    .catch(err => console.log(err))
// mongoose.set('useFindAndModify', false)  