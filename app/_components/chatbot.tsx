"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Sparkles, X } from "lucide-react";
import { parseAsBoolean, parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";

export function Chatbot() {
  const [chatOpen, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString,
  );
  const [input, setInput] = useState("");
  const initialMessageSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include"
    }),
  });

  useEffect(() => {
    if (
      chatOpen &&
      chatInitialMessage &&
      !initialMessageSentRef.current &&
      messages.length === 0
    ) {
      initialMessageSentRef.current = true;
      sendMessage({ text: chatInitialMessage });
      setChatInitialMessage(null);
    }
  }, [chatOpen, chatInitialMessage, messages.length, sendMessage, setChatInitialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chatOpen) return null;

  const handleClose = () => {
    setChatOpen(null);
    initialMessageSentRef.current = false;
  };

  const handleSend = () => {
    if (!input.trim() || status === "streaming") return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleSuggestion = (text: string) => {
    sendMessage({ text });
  };

  const isStreaming = status === "streaming" || status === "submitted";

  return (
    <>
      <div
        className="fixed inset-0 bg-foreground/30 z-40"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-50 flex flex-col pt-[160px] px-4 pb-4">
        <div className="flex flex-col flex-1 bg-background rounded-[20px] overflow-hidden min-h-0">
          <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
            <div className="flex gap-2 items-center">
              <div className="bg-primary/[0.08] border border-primary/[0.08] flex items-center justify-center p-3 rounded-full shrink-0">
                <Sparkles className="size-[18px] text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="font-inter-tight font-semibold text-base text-foreground leading-[1.05]">
                  Coach AI
                </span>
                <div className="flex items-center gap-1">
                  <div className="size-2 rounded-full bg-primary" />
                  <span className="font-inter-tight text-xs text-primary leading-[1.15]">
                    Online
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="size-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-5 p-5 min-h-0">
            {messages.map((msg) => {
              const text = msg.parts
                .filter((p) => p.type === "text")
                .map((p) => p.text)
                .join("");

              if (msg.role === "user") {
                return (
                  <div key={msg.id} className="flex justify-end pl-[60px]">
                    <div className="bg-primary rounded-[12px] p-3">
                      <p className="text-primary-foreground text-sm font-inter-tight leading-[1.4]">
                        {text}
                      </p>
                    </div>
                  </div>
                );
              }

              if (!text) {
                return (
                  <div key={msg.id} className="flex justify-start pr-[60px]">
                    <div className="bg-secondary rounded-[12px] p-3">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
                        <span className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex justify-start pr-[60px]">
                  <div className="bg-secondary rounded-[12px] p-3 w-full">
                    <Streamdown className="text-foreground text-sm font-inter-tight leading-[1.4] prose-sm dark:prose-invert max-w-none">
                      {text}
                    </Streamdown>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 0 && (
            <div className="flex gap-2.5 px-5 pb-3 overflow-x-auto shrink-0">
              <button
                onClick={() => handleSuggestion("Monte meu plano de treino")}
                className="bg-day-started flex items-center justify-center px-4 py-2 rounded-full shrink-0 text-sm font-inter-tight text-foreground whitespace-nowrap"
              >
                Monte meu plano de treino
              </button>
            </div>
          )}

          <div className="border-t border-border p-5 shrink-0">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 bg-muted border border-muted px-4 py-3 rounded-full text-sm font-inter-tight text-foreground placeholder:text-muted-foreground outline-none"
                placeholder="Digite sua mensagem"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button
                className="bg-primary rounded-full size-[42px] shrink-0 p-0 hover:bg-primary/90"
                onClick={handleSend}
                disabled={isStreaming || !input.trim()}
              >
                <ArrowUp className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
