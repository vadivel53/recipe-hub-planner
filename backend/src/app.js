const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger API Docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/recipes', require('./routes/recipe.routes'));
app.use('/api/planner', require('./routes/planner.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Health check / landing page for browser users
app.get('/', (req, res) => {
  res.type('html').send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Recipe Hub API</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; line-height: 1.5; }
          code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>Recipe Hub API is running</h1>
        <p>Backend server is healthy.</p>
        <p>Swagger docs: <a href="/api/docs">/api/docs</a></p>
        <p>Frontend (if running): <a href="http://localhost:5173">http://localhost:5173</a></p>
        <p>API base: <code>/api</code></p>
      </body>
    </html>
  `);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
