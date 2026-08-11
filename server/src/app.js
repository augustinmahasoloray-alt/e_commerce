import authRoutes from "./routes/auth.routes.js"
import express from "express";
import cors from "cors";
import errorMiddleware from "./middlewares/error.middleware.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express()
app.use(cors())
app.use(express.json())

//code d'api
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware)

export default app;

