"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getTicketMessages, sendMessage } from "@/http/api";
import { Conversation, MessageType } from "@/types/messages";
import Spinner from "@/components/svgs/Spinner";
import { format } from "date-fns";
import Image from "next/image";
import DefaultAvatar from "@/components/ui/default-avatar";

interface ChatWindowProps {
  conversation: Conversation;
  isHostView?: boolean;
}

export default function ChatWindow({ conversation, isHostView = false }: ChatWindowProps) {
  const userId = useSelector((state: RootState) => state.user.me?.user?.id);
  const hostId = useSelector((state: RootState) => state.user.me?.host?.id);
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageText, setMessageText] = useState("");

  const queryKeyPrefix = isHostView ? "ticket-messages-host" : "ticket-messages-user";
  const listQueryKey = isHostView ? "messages-host" : "messages-user";

  const { data, isLoading } = useQuery({
    queryKey: [queryKeyPrefix, conversation.id],
    queryFn: () => getTicketMessages(conversation.id),
    enabled: !!conversation.id,
    refetchInterval: 200,
  });

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeyPrefix, conversation.id],
      });
      queryClient.invalidateQueries({ queryKey: [listQueryKey] });
    },
  });

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const senderId = isHostView ? hostId : userId;
    mutation.mutate({
      ticketId: conversation.id,
      hostId: isHostView ? hostId : conversation.guestId,
      message: messageText,
      senderId,
      userId: isHostView ? data?.userId : userId,
    } as MessageType);
    setMessageText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatMessageTime = (dateStr: string, timeStr: string) => {
    // Combine date and time if they are separate
    const date = new Date(`${dateStr} ${timeStr}`);
    return format(date, "M/d/yyyy h:mm:ss a");
  };

  const isSameDay = (d1: string, d2: string) => {
    return d1 === d2;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <Spinner size={17} color="red" />
      </div>
    );
  }

  const messages = data?.messages || [];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-6 pt-14 sm:py-3 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          {conversation.guestAvatar ? (
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm ring-2 ring-offset-2 ring-gray-100">
              <Image
                src={conversation.guestAvatar}
                alt={conversation.guestName}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            <DefaultAvatar size="sm" />
          )}
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">
              {conversation.guestName}
            </h2>
            <p className="text-sm text-gray-500">{conversation.propertyName}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 chat-background">
        <div className="space-y-1">
          {messages.map((msg: any, index: number) => {
            const isHost = msg.host; // true if message is from host (guest in your context)
            const showDateSeparator =
              index === 0 || !isSameDay(msg.date, messages[index - 1].date);

            const isFromOther = isHostView ? !isHost : isHost;

            return (
              <div key={index}>
                {showDateSeparator && (
                  <div className="flex items-center justify-center my-6">
                    <div className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-medium shadow-sm">
                      {msg.date}
                    </div>
                  </div>
                )}

                <div
                  className={`flex items-end gap-2 mb-1 ${
                    isFromOther ? "justify-start" : "justify-end"
                  }`}
                >
                  {isFromOther && (
                    <>
                      {conversation.guestAvatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm flex-shrink-0">
                          <Image
                            src={conversation.guestAvatar}
                            alt={conversation.guestName}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <DefaultAvatar size="xs" />
                      )}
                    </>
                  )}

                  <div
                    className={`flex flex-col ${
                      isFromOther ? "items-start" : "items-end"
                    } max-w-[75%] animate-fade-in`}
                  >
                    {!isFromOther && (
                      <span className="text-xs text-gray-500 mb-1 px-1 font-medium">
                        You
                      </span>
                    )}
                    <div className="relative">
                      <div
                        className={`px-4 py-3 transition-all duration-200 ${
                          isFromOther
                            ? "bg-white text-gray-900 rounded-2xl rounded-bl-sm shadow-md border border-gray-200 hover:shadow-lg hover:border-gray-300"
                            : "bg-gradient-to-br from-red-600 to-red-700 text-white rounded-2xl rounded-br-sm shadow-lg hover:shadow-xl"
                        }`}
                      >
                        <p
                          className={`text-sm whitespace-pre-wrap break-words leading-relaxed ${
                            isFromOther ? "text-gray-800" : "text-white"
                          }`}
                        >
                          {msg.message}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-xs text-gray-400 mt-1.5 px-2 ${
                        isFromOther ? "text-left" : "text-right"
                      }`}
                    >
                      {formatMessageTime(msg.date, msg.time)}
                    </div>
                  </div>

                  {!isFromOther && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white shadow-sm">
        <form onSubmit={handleSend} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="type your message here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-sm hover:border-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={!messageText.trim() || mutation.isPending}
            className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center flex-shrink-0 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 disabled:hover:scale-100"
            title="Send message"
          >
            {mutation.isPending ? (
              <Spinner color="white" size={20} />
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
