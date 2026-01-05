import Sidebar from "@/components/Sidebar";
import ChatHeader from "@/components/ChatHeader";
import ChatMessages from "@/components/ChatMessages";
import ChatInput from "@/components/ChatInput";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useChatStore, setChatNavigate } from "@/store/chat.store";

const Chat = () => {
  const navigate = useNavigate();
  const { chatId } = useParams();

  const { setActiveChat, fetchMessages } = useChatStore();

  useEffect(() => {
    setChatNavigate(navigate);
  }, [navigate]);

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId);
      fetchMessages(chatId);
    } else {
      setActiveChat(null);
    }
  }, [chatId]);

  return (
    <div className="h-screen flex">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <ChatHeader />
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
};

export default Chat;
