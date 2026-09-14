"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  ChatCircleDots,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import type { ShoppingAgentMessage } from "@/server/ai/shopping-agent";
import { Button } from "@/components/ui/button";

const transport = new DefaultChatTransport({ api: "/api/chat" });

export function ShoppingGuide() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const panelRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error, stop } =
    useChat<ShoppingAgentMessage>({ transport });

  React.useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  React.useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("textarea")?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panel) return;
      const controls = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      opener?.focus();
    };
  }, [open]);

  if (pathname.startsWith("/checkout")) return null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value || status !== "ready") return;
    void sendMessage({ text: value });
    setInput("");
  }

  return (
    <>
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Bakana shopping guide"
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(44rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--surface-page)] shadow-[var(--elevation-modal)] sm:left-auto sm:right-5 sm:w-[26rem]"
        >
          <header className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-[var(--surface-inverse)] text-[var(--accent-text)]">
                <Sparkle size={18} weight="fill" aria-hidden />
              </span>
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-h3)] font-semibold">
                  Bakana Guide
                </h2>
                <p className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                  Product guidance only
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close shopping guide"
              className="grid size-11 place-items-center rounded-[var(--radius-md)] hover:bg-[var(--surface-subtle)]"
            >
              <X size={20} aria-hidden />
            </button>
          </header>

          <div ref={listRef} className="min-h-72 flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.length === 0 ? <GuideWelcome onPrompt={setInput} /> : null}
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {status === "submitted" ? (
              <p className="text-[length:var(--text-body-sm)] text-[var(--text-secondary)]">
                Checking verified information…
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-[var(--radius-md)] bg-[var(--state-error-bg)] p-3 text-[length:var(--text-body-sm)] text-[var(--state-error)]">
                The guide is unavailable. Try again.
              </p>
            ) : null}
          </div>

          <form onSubmit={submit} className="w-full min-w-0 max-w-full overflow-hidden border-t border-[var(--border-subtle)] p-4">
            <label htmlFor="shopping-guide-input" className="mb-2 block text-[length:var(--text-caption)] font-medium text-[var(--text-secondary)]">
              Ask about Bakana products
            </label>
            <div className="flex items-end gap-2 w-full min-w-0 max-w-full">
              <textarea
                id="shopping-guide-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={2}
                maxLength={500}
                placeholder="Which pack suits me?"
                className="min-h-12 flex-1 min-w-0 max-w-full resize-none rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] px-3 py-3 text-[length:var(--text-body)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--border-focus)]"
                disabled={status !== "ready"}
              />
              {status === "streaming" ? (
                <Button type="button" size="icon" variant="secondary" onClick={stop} aria-label="Stop response">
                  <X size={18} aria-hidden />
                </Button>
              ) : (
                <Button type="submit" size="icon" disabled={!input.trim() || status !== "ready"} aria-label="Send message">
                  <ArrowUp size={18} aria-hidden />
                </Button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-3 right-3 z-30 size-12 p-0 shadow-[var(--elevation-modal)] sm:bottom-5 sm:right-5 sm:h-auto sm:w-auto sm:px-5 sm:py-3"
          aria-label="Open Bakana shopping guide"
        >
          <ChatCircleDots size={20} weight="fill" aria-hidden />
          <span className="sr-only sm:not-sr-only">Ask Bakana</span>
        </Button>
      )}
    </>
  );
}

function GuideWelcome({ onPrompt }: { onPrompt: (value: string) => void }) {
  const prompts = [
    "Show available pack sizes",
    "How do I prepare it?",
    "Which pack is largest?",
  ];
  return (
    <div>
      <p className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-semibold">
        Ask about the blend.
      </p>
      <p className="mt-2 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-secondary)]">
        Prices and availability stay verified.
      </p>
      <div className="mt-5 grid gap-2">
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
            className="min-h-11 rounded-[var(--radius-md)] border border-[var(--border-subtle)] px-3 text-left text-[length:var(--text-body-sm)] hover:bg-[var(--surface-subtle)]"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Message({ message }: { message: ShoppingAgentMessage }) {
  return (
    <div className={message.role === "user" ? "ml-10" : "mr-5"}>
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <p
              key={`${message.id}-${index}`}
              className={
                message.role === "user"
                  ? "rounded-[var(--radius-lg)] bg-[var(--action-primary-bg)] px-4 py-3 text-[length:var(--text-body-sm)] leading-relaxed text-[var(--action-primary-text)]"
                  : "text-[length:var(--text-body-sm)] leading-relaxed text-[var(--text-primary)]"
              }
            >
              {part.text}
            </p>
          );
        }

        if (part.type === "tool-searchProducts") {
          if (part.state !== "output-available") {
            return (
              <p key={part.toolCallId} className="text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                Checking products…
              </p>
            );
          }
          return (
            <div key={part.toolCallId} className="mt-3 grid gap-3">
              {part.output.products.map((product) => (
                <article key={product.id} className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-4">
                  <h3 className="font-[family-name:var(--font-display)] font-semibold">
                    {product.name}
                  </h3>
                  <div className="mt-2 space-y-1 text-[length:var(--text-caption)] text-[var(--text-secondary)]">
                    {product.variants.map((variant) => (
                      <p key={variant.id}>
                        {variant.name} · {variant.priceFormatted} · {variant.available} available
                      </p>
                    ))}
                  </div>
                  <Link href={product.url} className="mt-3 inline-block text-[length:var(--text-body-sm)] font-medium text-[var(--text-accent)] underline underline-offset-4">
                    View product
                  </Link>
                </article>
              ))}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
