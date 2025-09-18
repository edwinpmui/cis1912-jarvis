"use client";

import { Box, Flex, Text, Card, Avatar } from "@radix-ui/themes";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface Message {
  id: number;
  chat_id?: number;
  content: string;
  role: "user" | "assistant";
  response_id?: string;
  status?: "complete" | "generating" | "error";
  extra_data?: Record<string, any>;
  timestamp?: Date;
}

interface MessageProps {
  message: Message;
}

export default function Message({ message }: MessageProps) {
  return (
    <Box py="2">
      <Flex justify={message.role === "user" ? "end" : "start"}>
        {message.role === "user" ? (
          <Card
            style={{
              maxWidth: "85%",
              backgroundColor: "var(--accent-4)",
              border: "none",
              boxShadow: "none",
            }}
            size="1"
          >
            <Flex gap="3" align="start">
              <Avatar fallback="U" radius="full" />
              <Box
                style={{
                  flex: 1,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                <Text>{message.content}</Text>
              </Box>
            </Flex>
          </Card>
        ) : (
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              maxWidth: "90%",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
            {message.status === "generating" && (
              <Text size="1" color="gray" style={{ fontStyle: "italic" }}>
                Generating...
              </Text>
            )}
            {message.status === "error" && (
              <Text size="1" color="red" style={{ fontStyle: "italic" }}>
                Error generating response
              </Text>
            )}
          </Box>
        )}
      </Flex>
    </Box>
  );
}
