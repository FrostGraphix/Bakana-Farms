import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms governing orders, delivery, and trade with Bakana Farms.",
};

export default function TermsPage() {
  return (
    <PolicyPage
      eyebrow="Terms of Service"
      title="Terms for transparent trade."
      summary="These terms govern your purchases, payment obligations, delivery conditions, and commercial rights when interacting with Bakana Farms Limited."
      lastUpdated="September 13, 2026"
      sections={[
        {
          title: "Storefront & Company Identity",
          body: "Bakana Farms Limited operates this storefront for direct consumer retail and wholesale inquiries for our Moringa, Honey, and Ginger botanical tea.",
          bullets: [
            "All transactions originate with Bakana Farms Limited, registered in Nigeria.",
            "Prices and checkout totals are calculated in minor integer units (kobo or cents) to prevent rounding discrepancies.",
            "Wholesale and B2B pricing schedules require verified registration and approved commercial documentation.",
          ],
        },
        {
          title: "Orders, Availability & Idempotency",
          body: "Stock availability is strictly governed by our real-time database ledger. An order is finalized only after successful payment clearance by our gateway.",
          bullets: [
            "Stock reservations remain active during checkout for a limited window before automated release.",
            "Every checkout request carries an idempotency token to prevent double charges upon browser refresh.",
            "In the unlikely event of concurrent checkout contention, orders unable to secure stock will be promptly refunded.",
          ],
        },
        {
          title: "Payments & Financial Security",
          body: "Payments are processed securely via Paystack. Bakana Farms does not store, capture, or transmit raw credit or debit card numbers.",
          bullets: [
            "Both NGN and USD transactions are processed through authorized payment channels.",
            "Checkout pages are protected under stringent security headers with zero unauthorized third-party tracker injection.",
            "Bank verification references and transaction hashes are retained in our financial ledger for statutory accounting.",
          ],
        },
        {
          title: "Shipping, Delivery & Export Terms",
          body: "Fulfilment begins immediately upon verified payment clearance. Timelines vary depending on destination geography and customs procedures.",
          bullets: [
            "Domestic orders within Nigeria are dispatched through verified regional freight and courier partners.",
            "International consignments and export master cartons are handled under agreed Incoterms (CIF/FOB).",
            "Phytosanitary inspection documents and certificates of origin accompany all commercial export freight.",
          ],
        },
        {
          title: "Food Safety, Nature of Product & Storage",
          body: "Our blend consists solely of botanical ingredients: dried Moringa leaves, natural wildflower honey, and warming ginger.",
          bullets: [
            "This product is a botanical food and herbal beverage, not a pharmaceutical drug or medical cure.",
            "Boxes should be stored in a cool, dry environment away from excessive humidity or direct solar radiation.",
            "Check sachet integrity before brewing. Discard sachets with punctured individual moisture seals.",
          ],
        },
        {
          title: "Returns, Replacements & Dispute Resolution",
          body: "If an order arrives damaged or fails to match your confirmed receipt, our team will investigate and issue a replacement or refund.",
          bullets: [
            "Damaged shipments must be reported within 72 hours of recorded carrier delivery with photo documentation.",
            "Opened or unsealed food packaging cannot be accepted for sanitary returns under statutory health regulations.",
            "Any unresolved commercial disputes shall be submitted to mediation under Nigerian commercial law.",
          ],
        },
      ]}
    />
  );
}
