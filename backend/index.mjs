import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/db.mjs";  
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.mjs";                                                                                                             
const app = express();

// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// routes use
// app.use("/admin", adminRoutes);
// app.use("/staff", staffRoutes);
app.use("/auth", authRoutes);


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