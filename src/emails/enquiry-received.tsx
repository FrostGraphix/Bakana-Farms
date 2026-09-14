import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

export function EnquiryReceivedEmail({
  heading,
  message,
}: {
  heading: string;
  message: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{heading}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>BAKANA FARMS</Text>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.copy}>{message}</Text>
          <Text style={styles.footer}>Keep this email for reference.</Text>
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
  footer: { color: "#6b5f4e", fontSize: "12px", marginTop: "28px" },
} as const;
