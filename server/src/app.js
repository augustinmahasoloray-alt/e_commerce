// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import vendorApplicationRoutes from "./routes/vendorApplication.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminProductRoutes from "./routes/adminProduct.routes.js";
import adminDashboardRoutes from "./routes/adminDashboard.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(
    cors({
        origin: "http://localhost:5173", // Remplace par l'URL de ton frontend
        credentials: true, // Pour autoriser les cookies
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendor-application", vendorApplicationRoutes);

// Middleware de gestion des erreurs
app.use(errorMiddleware);

app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

export default app;