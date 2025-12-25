import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideSunMedium, LucideMoonStar } from "lucide-react";

const Sidebar = () => {
  const { user, logout, isAuthActionLoading } = useAuthStore();
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <aside className="w-64 border-r bg-muted flex flex-col">
      {/* App title */}
      <div className="p-4 text-lg font-bold">Custom Agent</div>

      {/* New chat */}
      <div className="px-4 pb-4">
        <Button className="w-full">+ New Chat</Button>
      </div>

      {/* Chat list placeholder */}
      <div className="flex-1 px-4 text-sm text-muted-foreground">
        No chats yet
      </div>

      {/* Bottom user section */}
      <div className="border-t p-3 flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar key={user?.profileImage} className="h-10 w-10 ring">
                <AvatarImage
                  src={user?.profileImage || undefined}
                  alt={user?.username || "User"}
                />
                <AvatarFallback>{user?.username?.[0] ?? "U"}</AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium truncate max-w-[120px]">
                {user?.username?.split(" ")[0] ?? "User"}
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuItem asChild>
              <Button onClick={logout} disabled={isAuthActionLoading} className="w-full justify-start bg-red-400" variant="ghost" size="sm">
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
          {/* Sun */}
          <LucideSunMedium
            className="
      h-5 w-5 transition-all
      rotate-0 scale-100
      dark:-rotate-90 dark:scale-0
    "
          />

          {/* Moon */}
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
