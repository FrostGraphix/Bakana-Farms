import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata: Metadata = { title: "Returns", description: "Bakana Farms return and refund guidance." };

export default function ReturnsPage() {
  return <PolicyPage eyebrow="Returns" title="Problems deserve clear answers." summary="Tell us quickly when an order arrives damaged, incorrect, or incomplete." sections={[
    { title: "Report an issue", content: <p>Use the contact page with your order reference, delivery email, issue description, and helpful photographs.</p> },
    { title: "Product condition", content: <p>Keep the product, packaging, and delivery materials while support reviews the request.</p> },
    { title: "Review process", content: <p>Support checks payment, fulfilment, delivery, and product evidence before confirming the available resolution.</p> },
    { title: "Approved refunds", content: <p>Approved refunds return through the original payment channel. Provider processing times can vary.</p> },
    { title: "Before returning anything", content: <p>Wait for return instructions. Unauthorised parcels can become difficult to identify.</p> },
  ]} />;
}
