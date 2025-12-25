import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";

const ChatPage = () => {
  const { user, logout, isAuthActionLoading } = useAuthStore();
  const { toggleTheme } = useThemeStore();

  return (
    <div className="h-screen flex flex-col bg-muted">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b bg-background">
        <h1 className="text-xl font-semibold text-primary">Chat</h1>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggleTheme}>
            Toggle theme
          </Button>

          <Button loading={isAuthActionLoading} onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-xl border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Hi {user?.username}
          </p>
          <p className="text-foreground font-medium">
            Chat UI coming soon…
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
