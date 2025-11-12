import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import connectDB from './config/database.js'

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Initialize express app
const app = express()

// Middleware
app.use(helmet()) // Security headers
app.use(compression()) // Compress responses
app.use(morgan('dev')) // Logging

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Static files
app.use('/uploads', express.static('uploads'))

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Ecommerce API Server',
    version: '1.0.0',
    status: 'running',
  })
})

// Import routes
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import customerRoutes from './routes/customers.js'

// Use routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/customers', customerRoutes)

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
