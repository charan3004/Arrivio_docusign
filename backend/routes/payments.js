import express from "express";
import { createClient } from "@supabase/supabase-js";
import {
  createCashfreeOrder,
  handleCashfreeWebhook,
  processRefund,
} from "../services/cashfree.js";

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =========================================
   CREATE ORDER
========================================= */
router.post("/create-order", async (req, res) => {
  try {
    const {
      bookingIntentId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      userId,
    } = req.body;

    if (!bookingIntentId || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const orderId = `arrivio_${bookingIntentId}_${Date.now()}`;

    const order = await createCashfreeOrder({
      orderId,
      amount,
      customerName,
      customerEmail,
      customerPhone,
    });

    // Insert payment record
    await supabase.from("payments").insert([
      {
        booking_intent_id: bookingIntentId,
        user_id: userId,
        cashfree_order_id: orderId,
        amount,
        currency: "EUR",
        status: "created",
      },
    ]);

    // Mark booking intent as payment pending
    await supabase
      .from("booking_intents")
      .update({ status: "payment_pending" })
      .eq("id", bookingIntentId);

    return res.status(200).json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
    });
  } catch (error) {
    console.error("Create order error:", error.message);
    return res.status(500).json({ error: "Payment init failed" });
  }
});

/* =========================================
   VERIFY (Fallback Only)
========================================= */
router.post("/verify", async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false });
    }

    const result = await verifyCashfreePayment(orderId);
    return res.json(result);
  } catch (error) {
    console.error("Verify error:", error.message);
    return res.status(500).json({ success: false });
  }
});

/* =========================================
   PAYMENT STATUS (Used by Paid.jsx)
========================================= */
router.get("/status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const { data: payment } = await supabase
      .from("payments")
      .select(`
        *,
        booking_intents (
          status,
          property_id,
          check_in,
          check_out
        )
      `)
      .eq("cashfree_order_id", orderId)
      .single();

    if (!payment) {
      return res.status(404).json({ error: "Not found" });
    }

    return res.json(payment);
  } catch (error) {
    console.error("Status fetch error:", error.message);
    return res.status(500).json({ error: "Status fetch failed" });
  }
});

/* =========================================
   WEBHOOK (PRIMARY AUTHORITY)
========================================= */
router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    await handleCashfreeWebhook(req.body, signature, timestamp);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.status(400).json({ error: "Webhook rejected" });
  }
});


/* =========================================
   ADMIN REFUND (Manual Trigger)
========================================= */
router.post("/refund", async (req, res) => {
  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: "paymentId required" });
    }

    const result = await processRefund(paymentId);

    return res.json(result);
  } catch (error) {
    console.error("Refund error:", error.message);
    return res.status(500).json({ error: "Refund failed" });
  }
});

export default router;
/* =========================================
   ADMIN FETCH ALL PAYMENTS
========================================= */
router.get("/admin/all", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        booking_intents (
          property_id,
          check_in,
          check_out,
          status
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (error) {
    console.error("Admin fetch payments error:", error.message);
    return res.status(500).json({ error: "Failed to fetch payments" });
  }
});
