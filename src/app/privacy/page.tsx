import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "Data privacy and protection practices at Bakana Farms under the Nigeria Data Protection Act 2023.",
};

export default function PrivacyPage() {
  return (
    <PolicyPage
      eyebrow="Privacy Notice"
      title="Purposeful privacy for every relationship."
      summary="This notice details how Bakana Farms Limited collects, processes, protects, and disposes of personal data in compliance with the Nigeria Data Protection Act 2023 (NDPA) and the General Application and Implementation Directive (GAID) 2025."
      lastUpdated="September 13, 2026"
      sections={[
        {
          title: "Legal Framework & Governing Principles",
          body: "Our data practices are governed by the Nigeria Data Protection Act 2023 (NDPA) and the GAID 2025 directive issued by the Nigeria Data Protection Commission (NDPC).",
          bullets: [
            "We collect only the minimum personal data necessary to execute contracts, fulfil orders, and uphold legal duties.",
            "Consent is tracked as an immutable audit record stating the specific purpose, notice version, and timestamp.",
            "We do not sell, rent, or trade your personal information to advertisers, data brokers, or third-party marketing networks.",
          ],
        },
        {
          title: "Information We Collect",
          body: "When you interact with our storefront or submit commercial inquiries, we collect information needed to process your transaction and deliver product.",
          bullets: [
            "Customer Identity: Full name, delivery address, contact email address, and verified phone number.",
            "Commerce Records: Order reference numbers, items purchased, currency, delivery status, and payment provider tokens.",
            "Wholesale Data: Company legal name, tax identification numbers, country of import, and commercial contact persons.",
            "Technical & Security Logs: Anonymized IP addresses, session signatures, and fraud prevention signals.",
          ],
        },
        {
          title: "Payment Data & Zero-Exposure Guarantee",
          body: "Payment card data is collected directly by our PCI-DSS certified gateway provider, Paystack. Bakana Farms infrastructure never touches raw PANs or CVVs.",
          bullets: [
            "Checkout pages are protected from third-party script injection (no ad pixels, trackers, or foreign telemetry).",
            "We store only truncated card brands and the last 4 digits for customer reference and receipt generation.",
            "All payment communication is protected via TLS 1.3 encrypted transport.",
          ],
        },
        {
          title: "Data Processors & Third-Party Sharing",
          body: "Data is shared only with technical service providers essential to deliver our services, under strict confidentiality agreements.",
          bullets: [
            "Payment Gateway: Paystack for payment processing, settlement, and fraud detection.",
            "Transactional Messaging: Resend for order confirmations, delivery notifications, and customer service.",
            "Logistics & Couriers: Verified freight partners to dispatch physical cartons to your designated address.",
            "Regulatory Authorities: Disclosed only where strictly mandated by applicable Nigerian statutory law or court order.",
          ],
        },
        {
          title: "Data Retention & Erasure Rights",
          body: "In accordance with the NDPA and GAID 2025, personal data is retained only for as long as necessary to satisfy accounting, tax, or legal liabilities.",
          bullets: [
            "You possess the statutory right to request access, rectification, portability, or erasure of your personal data.",
            "When an erasure request is confirmed, personal identifiers are permanently scrubbed from our systems.",
            "Financial accounting records subject to statutory audit laws are retained in anonymized form.",
          ],
        },
        {
          title: "Data Protection Officer & Inquiries",
          body: "If you have questions regarding this Privacy Notice or wish to exercise your data subject rights, please reach out directly.",
          bullets: [
            "Privacy Inquiries: Submit requests via our online contact channel or email orders@bakanafarms.com.",
            "Regulatory Body: You have the right to lodge inquiries with the Nigeria Data Protection Commission (NDPC).",
            "Updates: This notice is reviewed periodically to ensure continuous alignment with NDPC directives.",
          ],
        },
      ]}
    />
  );
}
