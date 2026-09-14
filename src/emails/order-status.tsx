import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { formatMoney, type Currency } from "@/lib/utils";

type OrderStatusEmailProps = {
  reference: string;
  statusLabel: string;
  message: string;
  total: number;
  currency: Currency;
  items: Array<{ name: string; variantName: string; quantity: number }>;
  orderUrl: string;
};

export function OrderStatusEmail(props: OrderStatusEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Order {props.reference}: {props.statusLabel}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>BAKANA FARMS</Text>
          <Heading style={styles.heading}>{props.statusLabel}</Heading>
          <Text style={styles.copy}>{props.message}</Text>
          <Section style={styles.panel}>
            <Text style={styles.label}>ORDER REFERENCE</Text>
            <Text style={styles.reference}>{props.reference}</Text>
            <Hr style={styles.rule} />
            {props.items.map((item, index) => (
              <Text key={`${item.name}-${index}`} style={styles.item}>
                {item.quantity} × {item.name}, {item.variantName}
              </Text>
            ))}
            <Hr style={styles.rule} />
            <Text style={styles.total}>
              Total: {formatMoney(props.total, props.currency)}
            </Text>
          </Section>
          <Link href={props.orderUrl} style={styles.button}>
            View order
          </Link>
          <Text style={styles.footer}>
            Keep this reference available.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f1e7",
    color: "#241a12",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  container: {
    backgroundColor: "#fffdf8",
    border: "1px solid #d8cfbf",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "560px",
    padding: "36px",
  },
  eyebrow: {
    color: "#315b3d",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "2px",
  },
  heading: {
    color: "#241a12",
    fontFamily: "Georgia, serif",
    fontSize: "34px",
    lineHeight: "1.2",
    margin: "16px 0",
  },
  copy: { color: "#5d5145", fontSize: "16px", lineHeight: "1.6" },
  panel: {
    backgroundColor: "#f6f1e7",
    borderRadius: "12px",
    margin: "28px 0",
    padding: "20px",
  },
  label: { color: "#6b5f4e", fontSize: "11px", letterSpacing: "1.5px" },
  reference: { fontFamily: "monospace", fontSize: "20px", fontWeight: "700" },
  rule: { borderColor: "#d8cfbf", margin: "18px 0" },
  item: { color: "#5d5145", fontSize: "14px", lineHeight: "1.5" },
  total: { fontFamily: "monospace", fontSize: "16px", fontWeight: "700" },
  button: {
    backgroundColor: "#1f4930",
    borderRadius: "10px",
    color: "#fffdf8",
    display: "inline-block",
    fontSize: "15px",
    fontWeight: "700",
    padding: "14px 22px",
    textDecoration: "none",
  },
  footer: { color: "#6b5f4e", fontSize: "12px", marginTop: "28px" },
} as const;
