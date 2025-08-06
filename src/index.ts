import express from "express";
import dotenv from "dotenv";
import authRoutes from "./auth/routes/auth.routes";
import departmentRoutes from "./gettingStarted/department/department.routes";
import cors from "cors";
import helmet from "helmet";
import employeeRoutes from '../src/employee/routes/employee'
import projectRoutes from '../src/project/routes/project'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use('/',employeeRoutes)
app.use('/',projectRoutes)

app.get("/", (req, res) => {
  res.status(200).send("Firebase Auth Backend is Running!");
});

app.listen(PORT, () => {
  console.log(`Payroll portal is running at http://localhost:${PORT}`);
});
