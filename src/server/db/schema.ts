import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  primaryKey,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/**
 * SYSTEM OF RECORD.
 *
 * Orders, customers, inventory and payments live here and nowhere
 * else. Sanity holds editorial content only. Two reasons, both
 * load-bearing:
 *
 *   1. Correctness. Checking stock and creating an order must be
 *      one serialisable transaction. A content store has no row
 *      locking, so two concurrent checkouts on the last unit can
 *      both succeed.
 *   2. Erasure. NDPA and GAID 2025 require a real deletion path
 *      for personal data. Content stores are built to retain
 *      history and drafts, which is the opposite of what erasure
 *      needs.
 *
 * Money is ALWAYS integer minor units (kobo, cents). Never numeric,
 * never float. An order total off by a kobo is a reconciliation
 * failure that costs more to find than it ever cost to prevent.
 */

/* ===============================================================
   ENUMS
   =============================================================== */

export const currencyEnum = pgEnum("currency", ["NGN", "USD"]);

/**
 * The order state machine. Every transition is written to
 * order_events, and each one may fire exactly one email.
 *
 *   pending_payment -> paid -> processing -> packed -> shipped -> delivered
 *
 * with payment_failed, cancelled, refunded and partially_refunded
 * as branches. Nothing skips ahead: an order cannot reach shipped
 * without having passed through paid.
 */
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "paid",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "payment_failed",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

export const channelEnum = pgEnum("channel", ["b2c", "b2b"]);

export const accountTypeEnum = pgEnum("account_type", [
  "consumer",
  "distributor_pending",
  "distributor_approved",
  "suspended",
]);

/** Why stock moved. The ledger is append-only; nothing is overwritten. */
export const stockReasonEnum = pgEnum("stock_reason", [
  "intake",
  "reservation",
  "reservation_released",
  "sale",
  "restock",
  "adjustment",
  "damage",
  "return",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initialized",
  "succeeded",
  "failed",
  "refunded",
  "partially_refunded",
]);

/** VAT class. Under the Nigeria Tax Act 2025 food is zero-rated
 *  while supplements are standard-rated at 7.5%. Which one this
 *  product is has NOT been confirmed by the client's tax adviser,
 *  so it is a per-product field and never a hard-coded rate. */
export const taxClassEnum = pgEnum("tax_class", [
  "standard",
  "zero_rated",
  "exempt",
]);

/* ===============================================================
   CATALOGUE
   =============================================================== */

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),

    /** Marketing copy lives in Sanity. This is the join key. */
    sanityDocId: text("sanity_doc_id"),

    taxClass: taxClassEnum("tax_class").notNull().default("standard"),

    /** Needed for shipping rating and for export documentation. */
    hsCode: text("hs_code"),
    countryOfOrigin: text("country_of_origin").notNull().default("NG"),

    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("products_slug_idx").on(t.slug)]
);

/**
 * Variants carry price and stock, not products. Discovery lists
 * pack sizes as still under review, so the model has to hold more
 * than one from day one rather than be retrofitted later.
 */
export const variants = pgTable(
  "variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),

    sku: text("sku").notNull(),
    name: text("name").notNull(),

    priceNgn: integer("price_ngn").notNull(),
    priceUsd: integer("price_usd"),
    compareAtNgn: integer("compare_at_ngn"),

    weightGrams: integer("weight_grams").notNull(),

    /** Derived from the ledger, cached here for fast reads. Never
     *  written directly outside the stock service. */
    stockOnHand: integer("stock_on_hand").notNull().default(0),
    stockReserved: integer("stock_reserved").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(12),

    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("variants_sku_idx").on(t.sku),
    index("variants_product_idx").on(t.productId),
    check("variants_price_positive", sql`${t.priceNgn} > 0`),
    check("variants_stock_non_negative", sql`${t.stockOnHand} >= 0`),
    check("variants_reserved_non_negative", sql`${t.stockReserved} >= 0`),
  ]
);

/**
 * Append-only inventory ledger.
 *
 * This is what makes a scarcity signal honest. "Only 12 packs left"
 * is only allowed to appear on the site because this table can
 * prove it, not because someone typed 12 into a CMS field.
 */
export const stockMovements = pgTable(
  "stock_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),
    /** Signed. Negative removes stock. */
    delta: integer("delta").notNull(),
    reason: stockReasonEnum("reason").notNull(),
    orderId: uuid("order_id"),
    note: text("note"),
    actorId: uuid("actor_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("stock_movements_variant_idx").on(t.variantId, t.createdAt),
    index("stock_movements_order_idx").on(t.orderId),
  ]
);

/* ===============================================================
   CUSTOMERS
   =============================================================== */

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id"),
    email: text("email").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    passwordHash: text("password_hash"),

    firstName: text("first_name"),
    lastName: text("last_name"),
    phone: text("phone"),

    accountType: accountTypeEnum("account_type").notNull().default("consumer"),
    companyName: text("company_name"),

    /** Locale and currency preference, per roadmap 17.9. */
    preferredLocale: text("preferred_locale").notNull().default("en"),
    preferredCurrency: currencyEnum("preferred_currency")
      .notNull()
      .default("NGN"),

    /** Set on erasure request. The row is retained only where law
     *  requires the financial record, with PII nulled out. */
    anonymisedAt: timestamp("anonymised_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("customers_email_idx").on(t.email),
    uniqueIndex("customers_clerk_user_idx").on(t.clerkUserId),
    index("customers_account_type_idx").on(t.accountType),
  ]
);

export const addresses = pgTable(
  "addresses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    label: text("label"),
    recipient: text("recipient").notNull(),
    line1: text("line1").notNull(),
    line2: text("line2"),
    city: text("city").notNull(),
    state: text("state"),
    postalCode: text("postal_code"),
    countryCode: text("country_code").notNull(),
    phone: text("phone"),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("addresses_customer_idx").on(t.customerId)]
);

/**
 * Consent record. Not a boolean on the customer row.
 *
 * GAID 2025 expects a record of what was agreed and when. A single
 * `marketing_opt_in` flag cannot answer "which notice did they
 * agree to", which is exactly what an audit asks.
 */
export const consentRecords = pgTable(
  "consent_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "cascade",
    }),
    email: text("email").notNull(),
    purpose: text("purpose").notNull(),
    granted: boolean("granted").notNull(),
    noticeVersion: text("notice_version").notNull(),
    source: text("source").notNull(),
    ipAddress: text("ip_address"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("consent_email_idx").on(t.email, t.purpose),
    index("consent_customer_idx").on(t.customerId),
  ]
);

/* ===============================================================
   CARTS
   =============================================================== */

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    /** Guest carts key off a signed cookie token. */
    guestToken: text("guest_token"),
    currency: currencyEnum("currency").notNull().default("NGN"),
    /** Reservations expire so abandoned carts release their hold. */
    reservationExpiresAt: timestamp("reservation_expires_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("carts_customer_idx").on(t.customerId),
    uniqueIndex("carts_guest_token_idx").on(t.guestToken),
  ]
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => variants.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("cart_items_unique").on(t.cartId, t.variantId),
    check("cart_items_qty_positive", sql`${t.quantity} > 0`),
  ]
);

/* ===============================================================
   ORDERS
   =============================================================== */

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Human-facing reference. Shown on the confirmation page and
     *  quoted in every support conversation. */
    reference: text("reference").notNull(),

    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    email: text("email").notNull(),

    status: orderStatusEnum("status").notNull().default("pending_payment"),
    channel: channelEnum("channel").notNull().default("b2c"),

    currency: currencyEnum("currency").notNull(),

    /**
     * The FX rate actually applied, stamped at the moment of
     * charge. Never recomputed for display later: the customer is
     * owed the number they were charged at, not today's rate.
     * Stored as rate x 10^6 to keep it an integer.
     */
    fxRateMicros: integer("fx_rate_micros"),
    fxRateSource: text("fx_rate_source"),

    subtotal: integer("subtotal").notNull(),
    shippingAmount: integer("shipping_amount").notNull().default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    total: integer("total").notNull(),
    refundedAmount: integer("refunded_amount").notNull().default(0),

    /** Address is COPIED onto the order, not referenced. If the
     *  customer later edits their address book, historical orders
     *  must still show where the parcel actually went. */
    shippingAddress: jsonb("shipping_address").$type<StoredAddress>(),
    billingAddress: jsonb("billing_address").$type<StoredAddress>(),

    /**
     * Prevents a double-submit or a retried request from creating
     * two orders. Generated client-side per checkout attempt and
     * enforced here by the unique index.
     */
    idempotencyKey: text("idempotency_key"),

    notes: text("notes"),
    placedAt: timestamp("placed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_reference_idx").on(t.reference),
    uniqueIndex("orders_idempotency_idx").on(t.idempotencyKey),
    index("orders_customer_idx").on(t.customerId),
    index("orders_status_idx").on(t.status, t.createdAt),
    index("orders_email_idx").on(t.email),
    check("orders_total_non_negative", sql`${t.total} >= 0`),
    check(
      "orders_refund_within_total",
      sql`${t.refundedAmount} >= 0 AND ${t.refundedAmount} <= ${t.total}`
    ),
  ]
);

export type StoredAddress = {
  recipient: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  countryCode: string;
  phone?: string;
};

/**
 * Line items snapshot name, SKU and unit price at purchase time.
 * A price change next month must not silently rewrite what an
 * old order says the customer paid.
 */
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").references(() => variants.id, {
      onDelete: "set null",
    }),

    sku: text("sku").notNull(),
    name: text("name").notNull(),
    variantName: text("variant_name").notNull(),

    unitPrice: integer("unit_price").notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: integer("line_total").notNull(),
    taxRateBps: integer("tax_rate_bps").notNull().default(0),
  },
  (t) => [
    index("order_items_order_idx").on(t.orderId),
    check("order_items_qty_positive", sql`${t.quantity} > 0`),
  ]
);

/**
 * Append-only audit trail for orders.
 *
 * This table, not the platform's runtime logs, is the record of
 * what happened to an order. Vercel Hobby keeps logs for one hour,
 * which cannot answer "was this customer charged" the next
 * morning. See roadmap 14.6 M2.
 */
export const orderEvents = pgTable(
  "order_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status"),
    type: text("type").notNull(),
    payload: jsonb("payload"),
    actorId: uuid("actor_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("order_events_order_idx").on(t.orderId, t.createdAt)]
);

/* ===============================================================
   PAYMENTS
   =============================================================== */

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),

    provider: text("provider").notNull().default("paystack"),
    providerReference: text("provider_reference").notNull(),
    status: paymentStatusEnum("status").notNull().default("initialized"),

    amount: integer("amount").notNull(),
    currency: currencyEnum("currency").notNull(),

    /** Last four only. Raw card data never reaches our systems:
     *  the fields are gateway-hosted. */
    cardLast4: text("card_last4"),
    cardBrand: text("card_brand"),
    channel: text("channel"),

    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("payments_provider_ref_idx").on(t.provider, t.providerReference),
    index("payments_order_idx").on(t.orderId),
  ]
);

/**
 * Every webhook event, stored before it is processed.
 *
 * The unique index on (provider, event_id) is what makes webhook
 * handling idempotent. Gateways do resend, and without this a
 * duplicate delivery double-fulfils the order. This is also what
 * the reconciliation job reads to repair a missed delivery.
 */
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: text("provider").notNull(),
    eventId: text("event_id").notNull(),
    eventType: text("event_type").notNull(),
    signatureValid: boolean("signature_valid").notNull(),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    processingError: text("processing_error"),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("webhook_events_unique").on(t.provider, t.eventId),
    index("webhook_events_unprocessed_idx").on(t.processedAt),
  ]
);

export const refunds = pgTable(
  "refunds",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    paymentId: uuid("payment_id").references(() => payments.id, {
      onDelete: "set null",
    }),
    amount: integer("amount").notNull(),
    reason: text("reason").notNull(),
    status: text("status").notNull().default("requested"),
    idempotencyKey: text("idempotency_key").notNull(),
    providerReference: text("provider_reference"),
    actorId: uuid("actor_id"),
    actorReference: text("actor_reference"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("refunds_order_idx").on(t.orderId),
    uniqueIndex("refunds_idempotency_idx").on(t.idempotencyKey),
    check("refunds_amount_positive", sql`${t.amount} > 0`),
  ]
);

/* ===============================================================
   DISCOUNTS
   =============================================================== */

export const discountTypeEnum = pgEnum("discount_type", [
  "percentage",
  "fixed",
  "free_shipping",
]);

export const discounts = pgTable(
  "discounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    type: discountTypeEnum("type").notNull(),
    /** Basis points for percentage, minor units for fixed. */
    value: integer("value").notNull(),
    currency: currencyEnum("currency"),
    minimumSubtotal: integer("minimum_subtotal"),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    perCustomerLimit: integer("per_customer_limit"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("discounts_code_idx").on(t.code)]
);

export const discountRedemptions = pgTable(
  "discount_redemptions",
  {
    discountId: uuid("discount_id")
      .notNull()
      .references(() => discounts.id, { onDelete: "cascade" }),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.discountId, t.orderId] })]
);

/* ===============================================================
   WHOLESALE
   =============================================================== */

export const enquiryStatusEnum = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "quoted",
  "approved",
  "declined",
]);

export const wholesaleEnquiries = pgTable(
  "wholesale_enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    companyName: text("company_name").notNull(),
    registrationNumber: text("registration_number"),
    contactName: text("contact_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    destinationMarket: text("destination_market").notNull(),
    estimatedVolume: text("estimated_volume").notNull(),
    targetDeliveryWindow: text("target_delivery_window"),
    message: text("message"),
    status: enquiryStatusEnum("status").notNull().default("new"),
    ownerId: uuid("owner_id"),
    customerId: uuid("customer_id").references(() => customers.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("enquiries_status_idx").on(t.status, t.createdAt)]
);

export const supportEnquiries = pgTable(
  "support_enquiries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    orderReference: text("order_reference"),
    subject: text("subject").notNull(),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("support_enquiries_status_idx").on(t.status, t.createdAt),
    index("support_enquiries_email_idx").on(t.email),
  ]
);

/* ===============================================================
   EMAIL
   =============================================================== */

/**
 * Send log, used to enforce the daily quota.
 *
 * Resend's free tier caps at 100 sends a day. With the full
 * lifecycle that is roughly 12 orders before order confirmations
 * start failing, so sends are tiered and the low-priority ones
 * shed first. See roadmap 5.6.
 */
export const emailSends = pgTable(
  "email_sends",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    template: text("template").notNull(),
    tier: integer("tier").notNull(),
    recipient: text("recipient").notNull(),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    providerId: text("provider_id"),
    status: text("status").notNull().default("queued"),
    payload: jsonb("payload").$type<Record<string, string>>(),
    error: text("error"),
    shedReason: text("shed_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("email_sends_day_idx").on(t.createdAt),
    index("email_sends_order_idx").on(t.orderId),
  ]
);

/* ===============================================================
   ABUSE PROTECTION
   =============================================================== */

export const rateLimitBuckets = pgTable(
  "rate_limit_buckets",
  {
    key: text("key").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(1),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.key, t.windowStart] }),
    index("rate_limit_expiry_idx").on(t.expiresAt),
    check("rate_limit_count_positive", sql`${t.count} > 0`),
  ]
);

/* ===============================================================
   RELATIONS
   =============================================================== */

export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
  movements: many(stockMovements),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  consents: many(consentRecords),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
  events: many(orderEvents),
  payments: many(payments),
  refunds: many(refunds),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  customer: one(customers, {
    fields: [carts.customerId],
    references: [customers.id],
  }),
  items: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  variant: one(variants, {
    fields: [cartItems.variantId],
    references: [variants.id],
  }),
}));

export type Product = typeof products.$inferSelect;
export type Variant = typeof variants.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
