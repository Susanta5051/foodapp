import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.ts';
import bodyParser from "body-parser"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import userRouter from './routes/user.route.ts';
import resturantRouter from './routes/resturant.route.ts';
import menuRouter from './routes/menu.route.ts';
import orderRouter from './routes/order.route.ts';
import path from 'path';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

//moddlewares
const corsOptions = {
    origin:[
        "http://localhost:5173"
        process.env.CLIENT_URL, 
    ],
    credentials:true,
} 

const DIRNAME = path.resolve();
app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '10mb'}))
app.use(express.urlencoded({extended:true ,limit:'10mb'}))
app.use(express.json())
app.use(cookieParser())


//apis
app.use("/api/v1/user" , userRouter)
app.use("/api/v1/resturant" , resturantRouter)
app.use("/api/v1/menu" , menuRouter)
app.use('/api/v1/order',orderRouter)

app.use(express.static(path.join(DIRNAME,'/client/dist')))
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server Listening At Port ${PORT}`)
})
