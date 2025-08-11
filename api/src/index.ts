import express from 'express';
import cors from 'cors';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/dashboard', dashboardRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
