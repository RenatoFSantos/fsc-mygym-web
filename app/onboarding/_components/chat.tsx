"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";

const WELCOME_MESSAGES = [
  "Bem-vindo ao FIT.AI! 🎉",
  "O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.",
  "Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.",
  "Vamos configurar seu perfil?",
];

export function Chat() {
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [chatInitialMessage, setChatInitialMessage] = useQueryState(
    "chat_initial_message",
    parseAsString,
  );
  const initialMessageSentRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: `${process.env.NEXT_PUBLIC_API_URL}/ai`,
      credentials: "include",
    }),
  });

  useEffect(() => {
    if (chatInitialMessage && !initialMessageSentRef.current && messages.length === 0) {
      initialMessageSentRef.current = true;
      setStarted(true);
      sendMessage({ text: chatInitialMessage });
      setChatInitialMessage(null);
    }
  }, [chatInitialMessage, messages.length, sendMessage, setChatInitialMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, started]);

  const isStreaming = status === "streaming" || status === "submitted";

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleStart = () => {
    setStarted(true);
    sendMessage({ text: "Começar!" });
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 p-5 min-h-0">
        {WELCOME_MESSAGES.map((text, index) => (
          <div key={index} className="flex justify-start pr-[60px]">
            <div className="bg-secondary rounded-[12px] p-3">
              <p className="text-foreground text-sm font-inter-tight leading-[1.4]">
                {text}
              </p>
            </div>
          </div>
        ))}

        {!started && (
          <div className="flex justify-end pl-[60px]">
            <button
              className="bg-primary rounded-[12px] p-3 cursor-pointer"
              onClick={handleStart}
            >
              <p className="text-primary-foreground text-sm font-inter-tight leading-[1.4]">
                Começar!
              </p>
            </button>
          </div>
        )}

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
            className="rounded-full size-[42px] shrink-0 p-0"
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
          >
            <ArrowUp className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
