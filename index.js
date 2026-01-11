import express from 'express'
import cors from "cors"
import dotenv from "dotenv"
import { db } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, requestLogger } from './middleware/errorHandler.js';

dotenv.config();

const app = express()

app.use(cors());
app.use(express.json())
app.use(requestLogger);


// Routes
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Task Manager API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile'
            },
            tasks: {
                create: 'POST /api/tasks',
                getAll: 'GET /api/tasks',
                getOne: 'GET /api/tasks/:id',
                update: 'PUT /api/tasks/:id',
                delete: 'DELETE /api/tasks/:id',
                adminGetAll: 'GET /api/tasks/admin/all'
            }
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorHandler);

db.then(()=>{
    console.log("DB Connected.")
}).catch((err)=>{
    console.log("DB Error:", err);
    process.exit(1);
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})