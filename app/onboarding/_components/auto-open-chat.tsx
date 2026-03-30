"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import { useEffect, useRef } from "react";

export function AutoOpenChat() {
  const [, setChatOpen] = useQueryState(
    "chat_open",
    parseAsBoolean.withDefault(false),
  );
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setChatOpen(true);
    }
  }, [setChatOpen]);

  return null;
}
