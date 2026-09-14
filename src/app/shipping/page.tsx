import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata: Metadata = { title: "Shipping", description: "Bakana Farms delivery guidance." };

export default function ShippingPage() {
  return <PolicyPage eyebrow="Delivery" title="From our packhouse onward." summary="Available delivery methods, charges, and estimates appear before payment once confirmed for your destination." sections={[
    { title: "Delivery details", content: <p>Provide a complete address, reachable phone number, and accurate recipient name during checkout.</p> },
    { title: "Dispatch", content: <p>Paid orders move through processing, packing, shipping, and delivery states. Status messages follow recorded events.</p> },
    { title: "Tracking", content: <p>Use the tracking page with your order reference and checkout email.</p> },
    { title: "Delays", content: <p>Weather, access, customs, and carrier operations can affect estimates. Support can investigate stalled orders.</p> },
    { title: "International delivery", content: <p>Export destinations remain unavailable until required registrations, documentation, and rates are confirmed.</p> },
  ]} />;
}
