import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { parse } from 'url';
import dotenv from 'dotenv';
import next from 'next';
import express from 'express';
import http from 'http'; 

import connectDb from './config/db.ts';

import {
  productRoutes, authRoutes,
  categoryRoutes, reviewRoutes,
  orderRoutes, paymentRoutes,
  cartRoutes, couponRoutes,
  reportRoutes, pageRoutes
} from './routes'; 

dotenv.config(); 

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = express(); 
const httpServer = http.createServer(app);

// Initialize Next.js
const nextApp = next({ 
  dev,
  turbo: true,
  dir: '.',
  conf: {}
});
const nextHandler = nextApp.getRequestHandler();

const start = async () => {
  try { 
    // connect to dataBase
    await connectDb(); 

    // Prepare Next.js app
    await nextApp.prepare(); 

    // routes 
    app.use("/api/products", productRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/review", reviewRoutes);
    app.use("/api/order", orderRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupon", couponRoutes);  
    app.use("/api/page", pageRoutes);  
    app.use("/api/report", reportRoutes);  

    // Handle all other requests with Next.js
    app.use('*all', (req, res) => { 
      if (req.path.startsWith('/api')) return;
      const parsedUrl = parse(req.url, true);
      return nextHandler(req, res, parsedUrl);
    }); 

    // Start the Express server
    httpServer.listen(port, () => {
      console.log(`>🚀 Ready on port ${port}`);;
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error('Unknown error:', err);
    }
    process.exit(1); 
  }
}; 

start();
