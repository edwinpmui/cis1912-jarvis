"use client";

import { useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  TextArea,
  Heading,
  IconButton,
} from "@radix-ui/themes";
import Message, { Message as MessageType } from "./Message";
import BaseSidebarView from "./BaseSidebarView";
import { ArrowUpIcon } from "@radix-ui/react-icons";

interface ChatAreaProps {
  messages: MessageType[];
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isConnected: boolean;
  isConnecting: boolean;
  isCreatingChat: boolean;
}

export default function ChatArea({
  messages,
  input,
  setInput,
  handleSubmit,
  isConnected,
  isConnecting,
  isCreatingChat,
}: ChatAreaProps) {
  // Textarea padding - adjust this value to control vertical spacing
  const TEXTAREA_PADDING = 16; // Approximates top padding + bottom padding for the toolbar
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial textarea height
  useEffect(() => {
    if (textareaRef.current) {
      const lineHeight = getLineHeight();
      const minHeight = lineHeight + TEXTAREA_PADDING; // 1 line + padding
      textareaRef.current.style.height = `${minHeight}px`;
    }
  }, []);

  // Calculate line height based on font metrics
  const getLineHeight = () => {
    if (!textareaRef.current) return 24; // fallback

    const computedStyle = window.getComputedStyle(textareaRef.current);
    const fontSize = parseFloat(computedStyle.fontSize);
    const lineHeight = computedStyle.lineHeight;

    // If line-height is 'normal' or a number, calculate it
    if (lineHeight === "normal") {
      return fontSize * 1.2; // Default line-height multiplier
    } else if (lineHeight.endsWith("px")) {
      return parseFloat(lineHeight);
    } else {
      return fontSize * parseFloat(lineHeight);
    }
  };

  // Reset textarea height when input is cleared
  useEffect(() => {
    if (!input.trim() && textareaRef.current) {
      const lineHeight = getLineHeight();
      const minHeight = lineHeight + TEXTAREA_PADDING; // line height + padding
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${minHeight}px`;
      textareaRef.current.style.overflowY = "hidden";
    }
  }, [input]);

  return (
    <BaseSidebarView>
      <Flex py="4" direction="column" style={{ height: "100vh", flex: 1 }}>
        {messages.length === 0 ? (
          // Empty State
          <Flex align="center" justify="center" style={{ flex: 1 }}>
            <Flex direction="column" align="center" gap="4">
              <Heading size="8">Hi, I'm Jarvis</Heading>
              <Text color="gray" size="4">
                How can I help you today?
              </Text>
            </Flex>
          </Flex>
        ) : (
          // Messages Area
          <Box px="6" style={{ flex: 1, overflowY: "auto" }}>
            <Box
              style={{
                width: "100%",
                maxWidth: "100%",
              }}
            >
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Box
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box style={{ position: "relative" }}>
              <TextArea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder={
                  isCreatingChat
                    ? "Creating chat..."
                    : isConnecting
                    ? "Connecting..."
                    : !isConnected && messages.length > 0
                    ? "Disconnected"
                    : "Message Jarvis..."
                }
                rows={1}
                resize="none"
                size="3"
                style={{
                  width: "100%",
                  paddingTop: "4px",
                  paddingBottom: "48px", // Add bottom padding for toolbar
                  minHeight: "auto",
                  maxHeight: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  const lineHeight = getLineHeight();
                  const minHeight = lineHeight + TEXTAREA_PADDING; // 1 line + padding
                  const maxHeight = lineHeight * 8 + TEXTAREA_PADDING; // 8 lines + padding

                  target.style.height = "auto";
                  const newHeight = Math.max(
                    Math.min(target.scrollHeight, maxHeight),
                    minHeight
                  );
                  target.style.height = newHeight + "px";

                  // Show scroll only when content exceeds max height
                  if (target.scrollHeight > maxHeight) {
                    target.style.overflowY = "auto";
                  } else {
                    target.style.overflowY = "hidden";
                  }
                }}
              />

              {/* Toolbar */}
              <Flex
                align="center"
                justify="end"
                gap="2"
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "8px",
                  right: "8px",
                  height: "32px",
                  pointerEvents: "none", // Allow clicks to pass through to buttons
                }}
              >
                <IconButton
                  type="submit"
                  disabled={!input.trim() || isCreatingChat || isConnecting}
                  variant="ghost"
                  size="2"
                  style={{
                    pointerEvents: "auto", // Re-enable pointer events for the button
                  }}
                >
                  <ArrowUpIcon
                    width={16}
                    height={16}
                    color="gray"
                    className="cursor-pointer"
                  />
                </IconButton>
              </Flex>
            </Box>
          </form>
        </Box>
      </Flex>
    </BaseSidebarView>
  );
}
