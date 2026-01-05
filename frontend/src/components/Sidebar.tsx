import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideSunMedium, LucideMoonStar } from "lucide-react";

import { Button } from "@/components/Button";
import { Loader } from "./Loader";

import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { useChatStore } from "@/store/chat.store";

const Sidebar = () => {
  const navigate = useNavigate();

  const { user, logout, isAuthActionLoading } = useAuthStore();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const {
    chats,
    fetchChats,
    fetchMessages,
    activeChatId,
    setActiveChat,
    reset,
    isFetchingChats,
  } = useChatStore();

  useEffect(() => {
    fetchChats();
  }, []);

  const handleNewChat = () => {
    reset();
    navigate("/chat");
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChat(chatId);
    await fetchMessages(chatId);
    navigate(`/chat/${chatId}`);
  };

  return (
    <aside className="w-64 border-r bg-muted flex flex-col">
      {/* App title */}
      <div className="p-4 text-lg font-bold">Custom Agent</div>

      {/* New chat */}
      <div className="px-4 pb-4">
        <Button className="w-full" onClick={handleNewChat}>
          + New Chat
        </Button>
      </div>

      {/* Chat list */}
      <div className="flex-1 px-2 space-y-1 overflow-y-auto">
        {isFetchingChats && (
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        )}

        {!isFetchingChats && chats.length === 0 && (
          <div className="px-2 text-sm text-muted-foreground">
            No chats yet
          </div>
        )}

        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => handleSelectChat(chat.id)}
            className={`
              w-full text-left px-3 py-2 rounded-md text-sm transition
              ${
                activeChatId === chat.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              }
            `}
          >
            Chat {chat.id.slice(0, 6)}
          </button>
        ))}
      </div>

      {/* Bottom user section */}
      <div className="border-t p-3 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-10 w-10 ring">
                <AvatarImage
                  src={user?.profileImage || undefined}
                  alt={user?.username || "User"}
                />
                <AvatarFallback>
                  {user?.username?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium truncate max-w-[120px]">
                {user?.username?.split(" ")[0] ?? "User"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Button
                onClick={logout}
                disabled={isAuthActionLoading}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-red-500"
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="relative"
        >
          <LucideSunMedium
            className="
              h-5 w-5 transition-all
              rotate-0 scale-100
              dark:-rotate-90 dark:scale-0
            "
          />

          <LucideMoonStar
            className="
              absolute h-5 w-5 transition-all
              rotate-90 scale-0
              dark:rotate-0 dark:scale-100
            "
          />
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
