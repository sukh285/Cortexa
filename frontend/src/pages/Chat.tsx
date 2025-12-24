import { Button } from "@/components/Button";
import { useAuthStore } from "@/store/auth.store";

const ChatPage = () => {
  const { user, logout, isAuthActionLoading } = useAuthStore();

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">Chat</h1>

        <div className="flex gap-2">
          <Button
            variant="destructive"
            loading={isAuthActionLoading}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <span>Hi {user?.username}</span>
        <div>Chat ui soon...</div>
      </main>
    </div>
  );
};

export default ChatPage;
