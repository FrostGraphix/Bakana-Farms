import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy-page";

export const metadata: Metadata = { title: "Cookies", description: "Cookies used by the Bakana Farms storefront." };

export default function CookiesPage() {
  return <PolicyPage eyebrow="Cookies" title="Only useful storage belongs here." summary="The current storefront uses essential browser storage. Advertising cookies are not installed." sections={[
    { title: "Theme preference", content: <p>A theme cookie remembers light, dark, or system mode for one year.</p> },
    { title: "Guest cart", content: <p>A secure identifier keeps cart contents connected while you browse and checkout.</p> },
    { title: "Authentication", content: <p>Clerk can set essential cookies when account features are configured and used.</p> },
    { title: "Analytics", content: <p>No advertising pixels are currently configured. Any future analytics requiring consent must remain disabled until permission is given.</p> },
    { title: "Controls", content: <p>Browser settings can remove cookies. Removing essential cookies may clear carts, sessions, or saved preferences.</p> },
  ]} />;
}
