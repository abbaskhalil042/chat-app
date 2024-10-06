
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/dbConnect';
import router from './routes/user.routes';

dotenv.config();

const app = express();
const port = process.env.PORT||3000;

app.use(express.json());

connectDB();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Node.js!');
});

app.use("/api/users",router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
