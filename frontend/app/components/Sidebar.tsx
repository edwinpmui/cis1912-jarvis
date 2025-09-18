"use client";

import {
  Box,
  Flex,
  Text,
  Button,
  Heading,
  IconButton,
  Avatar,
} from "@radix-ui/themes";
import { useProfileStore } from "@/app/stores/profileStore";
import { authService } from "@/app/services/authService";
import { useNavigation } from "@/app/contexts/NavigationContext";
import { useChatStore } from "@/app/stores/chatStore";
import { useEffect } from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  FileIcon,
  PlusIcon,
  HamburgerMenuIcon,
  ChatBubbleIcon,
} from "@radix-ui/react-icons";

interface SidebarProps {
  isSidebarExpanded: boolean;
  setIsSidebarExpanded: (expanded: boolean) => void;
  children: React.ReactNode;
}

export default function Sidebar({
  isSidebarExpanded,
  setIsSidebarExpanded,
  children,
}: SidebarProps) {
  const { user } = useProfileStore();
  const { currentView, navigateToView } = useNavigation();
  const { chats, currentChat, setCurrentChat, fetchChats } = useChatStore();

  // Fetch chats when sidebar expands or user switches to chat view
  useEffect(() => {
    if (currentView === "chat") {
      fetchChats().catch(console.error);
    }
  }, [currentView, fetchChats]);

  const handleProfileClick = () => {
    if (currentView === "profile") {
      navigateToView("chat");
    } else {
      navigateToView("profile");
    }
  };

  const handleChatClick = () => {
    navigateToView("chat");
  };

  const handleNewChat = () => {
    setCurrentChat(null);
  };

  const handleChatSelect = (chat: any) => {
    setCurrentChat(chat);
  };

  const handleNotesClick = () => {
    navigateToView("notes");
  };

  const handleSignOut = async () => {
    try {
      await authService.signout();
      window.location.reload();
    } catch (error) {
      console.error("Sign out failed:", error);
      window.location.reload();
    }
  };

  return (
    <Flex height="100vh">
      {/* Left Sidebar */}
      <Box
        style={{
          width: isSidebarExpanded ? "260px" : "60px",
          transition: "width 200ms ease",
        }}
      >
        <Box
          style={{
            height: "100%",
            backgroundColor: "#DDDDDD",
            color: "black",
          }}
        >
          <Flex direction="column" height="100%" justify="between">
            <div>
              {/* Sidebar Header */}
              <Flex
                align="center"
                justify={isSidebarExpanded ? "between" : "center"}
                gap="3"
                p="3"
                style={{ height: "60px" }}
              >
                {/* Toggle Button */}

                {/* Title - only show when expanded */}
                {isSidebarExpanded && (
                  <div className="text-3xl font-thin">Jarvis</div>
                )}
                <IconButton
                  variant="ghost"
                  size="2"
                  onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                >
                  <HamburgerMenuIcon width={16} height={16} />
                </IconButton>
              </Flex>

              {/* Navigation Buttons */}
              <Box p="3">
                <Flex direction="column" gap="2">
                  <Button
                    variant={currentView === "chat" ? "solid" : "outline"}
                    size="2"
                    onClick={handleChatClick}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      justifyContent: isSidebarExpanded
                        ? "flex-start"
                        : "center",
                    }}
                  >
                    <ChatBubbleIcon width={16} height={16} />
                    {isSidebarExpanded && <Text ml="2">Chats</Text>}
                  </Button>

                  <Button
                    variant={currentView === "notes" ? "solid" : "outline"}
                    size="2"
                    onClick={handleNotesClick}
                    style={{
                      width: "100%",
                      cursor: "pointer",
                      justifyContent: isSidebarExpanded
                        ? "flex-start"
                        : "center",
                    }}
                  >
                    <FileIcon width={16} height={16} />
                    {isSidebarExpanded && <Text ml="2">Notes</Text>}
                  </Button>
                </Flex>
              </Box>

              {/* Chat History - Only show when expanded and on chat view */}
              {isSidebarExpanded && currentView === "chat" && (
                <Box style={{ flex: 1, overflowY: "auto" }} p="3">
                  <Flex direction="column" gap="2">
                    <Button
                      variant="outline"
                      size="2"
                      onClick={handleNewChat}
                      style={{
                        width: "100%",
                        cursor: "pointer",
                        justifyContent: "flex-start",
                      }}
                    >
                      <PlusIcon width={16} height={16} />
                      {isSidebarExpanded && <Text ml="2">New Chat</Text>}
                    </Button>
                    {isSidebarExpanded && (
                      <Text size="2" color="gray">
                        Chats
                      </Text>
                    )}
                    {chats.map((chat) => (
                      <Button
                        key={chat.id}
                        variant={currentChat?.id === chat.id ? "solid" : "soft"}
                        size="2"
                        onClick={() => handleChatSelect(chat)}
                        style={{
                          width: "100%",
                          justifyContent: "flex-start",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          cursor: "pointer",
                        }}
                      >
                        <Text
                          style={{
                            textOverflow: "ellipsis",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chat.title}
                        </Text>
                      </Button>
                    ))}
                  </Flex>
                </Box>
              )}
            </div>

            {/* User Section */}
            <div className="w-full flex justify-center p-4">
              <Flex align="center" gap="3">
                <IconButton
                  variant={currentView === "profile" ? "solid" : "soft"}
                  size="2"
                  onClick={handleProfileClick}
                  style={{
                    flexShrink: 0,
                    cursor: "pointer",
                    borderRadius: "100%",
                  }}
                >
                  {user?.first_name?.charAt(0).toUpperCase() || "U"}
                </IconButton>

                {isSidebarExpanded && (
                  <Button
                    variant="soft"
                    size="2"
                    onClick={handleSignOut}
                    style={{
                      color: "red",
                      flex: 1,
                      justifyContent: "flex-start",
                      cursor: "pointer",
                    }}
                  >
                    Sign Out
                  </Button>
                )}
              </Flex>
            </div>
          </Flex>
        </Box>
      </Box>

      {/* Main Content Area */}
      {children}
    </Flex>
  );
}
