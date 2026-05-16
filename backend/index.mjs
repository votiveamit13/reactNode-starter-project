import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/db.mjs";  
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";  
import categoryRoutes from "./routes/categoryRoutes.mjs";
import productRoutes from "./routes/productRoutes.mjs";
import brandRoutes from "./routes/brandRoutes.mjs";
import inventoryRoutes from "./routes/inventoryRoutes.mjs";
import userManagementRoutes from "./routes/userManagementRoutes.mjs";
import eventRoutes from "./routes/eventRoutes.mjs";
import eventCategoryRoutes from "./routes/eventCategoryRoutes.mjs";

const app = express();

// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// routes use
// app.use("/admin", adminRoutes);
// app.use("/staff", staffRoutes);
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/brands", brandRoutes);
app.use("/inventories", inventoryRoutes);
app.use("/users", userManagementRoutes);
app.use("/event", eventRoutes);
app.use(
  "/uploads",
  express.static("public/uploads")
);

app.use(
  "/event-category",
  eventCategoryRoutes
);


app.get("/", (req, res) => {
  res.send("API Running");
});
const PORT = process.env.PORT || 4001;

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("DB Connected");
  } catch (err) {
    console.log("DB Error:", err);
  }
});