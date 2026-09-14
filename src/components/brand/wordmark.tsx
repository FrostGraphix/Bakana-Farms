import Image from "next/image";
import { cn } from "@/lib/utils";

export function Wordmark({
  className,
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-block shrink-0 overflow-hidden",
        full ? "aspect-square h-32" : "aspect-square h-12",
        className
      )}
    >
      <Image
        src="/images/bakana-logo.png"
        alt="Bakana Farms"
        fill
        priority
        sizes={full ? "128px" : "48px"}
        className="object-contain"
      />
    </span>
  );
}
