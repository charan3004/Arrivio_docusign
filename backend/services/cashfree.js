import axios from "axios";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const CASHFREE_BASE_URL =
  process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* =========================================
   CREATE ORDER
========================================= */
export async function createCashfreeOrder({
  orderId,
  amount,
  customerName,
  customerEmail,
  customerPhone,
}) {
  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      {
        order_id: orderId,
        order_amount: Number(amount),
        order_currency: "INR",
        customer_details: {
          customer_id: `cust_${orderId.slice(-20)}`,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/paid?order_id={order_id}`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Cashfree Order Creation Failed");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error(error);
    }

    throw error;
  }
}

/* =========================================
   WEBHOOK HANDLER (FIXED)
========================================= */
export async function handleCashfreeWebhook(rawBody, signature, timestamp) {
  if (!signature) {
    throw new Error("Missing webhook signature");
  }

  const bodyString = rawBody.toString("utf8");

  const signedPayload = timestamp
    ? timestamp + bodyString
    : bodyString;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
    .update(signedPayload)
    .digest("base64");

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    console.error("❌ Signature mismatch");
    throw new Error("Invalid signature");
  }

  const payload = JSON.parse(bodyString);

  const orderId =
    payload?.data?.order?.order_id ||
    payload?.data?.payment?.order_id;

  const paymentStatus =
    payload?.data?.payment?.payment_status ||
    payload?.data?.order?.order_status;

  if (!orderId) return;

  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("cashfree_order_id", orderId)
    .single();

  if (!payment) return;

  // FAILED case
  if (paymentStatus === "FAILED") {
    await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("id", payment.id);

    return;
  }

  // Only process successful payments
  if (paymentStatus !== "SUCCESS") return;

  // Idempotency
  if (payment.status === "success") return;

  const { data: bookingIntent } = await supabase
    .from("booking_intents")
    .select("*")
    .eq("id", payment.booking_intent_id)
    .single();

  if (!bookingIntent) return;

  /* =========================================
     🔥 UPDATED CONFLICT DETECTION (SELF SAFE)
  ========================================= */

  const { data: conflicts } = await supabase
    .from("booking_intents")
    .select("*")
    .eq("property_id", bookingIntent.property_id)
    .in("status", [
      "reserved_pending_verification",
      "verification_completed",
    ])
    .neq("id", bookingIntent.id) // 🔥 prevent self-conflict
    .lte("check_in", bookingIntent.check_out)
    .gte("check_out", bookingIntent.check_in);

  if (conflicts?.length > 0) {
    await supabase
      .from("payments")
      .update({
        status: "success",
        refund_status: "pending",
      })
      .eq("id", payment.id);

    await supabase
      .from("booking_intents")
      .update({ status: "conflict" })
      .eq("id", bookingIntent.id);

    return;
  }

  /* =========================================
     SUCCESS FLOW
  ========================================= */

  await supabase
    .from("payments")
    .update({ status: "success" })
    .eq("id", payment.id);

  await supabase
    .from("booking_intents")
    .update({ status: "reserved_pending_verification" })
    .eq("id", bookingIntent.id);
}

/* =========================================
   REFUND
========================================= */
export async function processRefund(paymentId) {
  const { data: payment } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status !== "success") {
    throw new Error("Only successful payments can be refunded");
  }

  if (payment.refund_status === "completed") {
    throw new Error("Refund already completed");
  }

  await supabase
    .from("payments")
    .update({ refund_status: "processing" })
    .eq("id", payment.id);

  try {
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders/${payment.cashfree_order_id}/refunds`,
      {
        refund_amount: payment.amount,
        refund_id: `refund_${Date.now()}`,
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "x-api-version": "2023-08-01",
        },
      }
    );

    await supabase
      .from("payments")
      .update({
        status: "refunded",
        refund_status: "completed",
        refunded_at: new Date(),
      })
      .eq("id", payment.id);

    return {
      success: true,
      cashfree_response: response.data,
    };
  } catch (error) {
    await supabase
      .from("payments")
      .update({
        refund_status: "failed",
      })
      .eq("id", payment.id);

    throw new Error("Refund API call failed");
  }
}
