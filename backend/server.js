import 'dotenv/config'; // Must be the very first line
import express from "express";
import cors from "cors";

import paymentsRoute from "./routes/payments.js";
import leaseRoute from "./routes/lease.js";

const app = express();

app.use(cors());

/* =========================================
   RAW BODY FOR PAYMENTS WEBHOOK (CRITICAL)
   Must come BEFORE express.json()
========================================= */
app.use("/api/payments/webhook", express.raw({ type: "*/*" }));

/* =========================================
   JSON PARSER FOR OTHER ROUTES
========================================= */
app.use(express.json());

/* =========================================
   ROUTES
========================================= */
app.use("/api/payments", paymentsRoute);
app.use("/api/lease", leaseRoute); // 🔹 Updated to be consistent REST style

app.get("/", (req, res) => {
  res.send("Arrivio Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});