"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

import {
  getMessagesByGuestId,
  getBookingsByUserId,
  createTicket,
  getTicketMessages,
} from "@/http/api";

import { Conversation } from "@/types/messages";

import MessageList from "@/components/messages/MessageList";
import ChatWindow from "@/components/messages/ChatWindow";
import ListingDetails from "@/components/messages/ListingDetails";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { Search, X, Pencil, ArrowRight } from "lucide-react";
import Spinner from "@/components/svgs/Spinner";

import { toast } from "sonner";

export default function InboxPage() {
  const userId = useSelector((state: RootState) => state.user.me?.user?.id);
  const queryClient = useQueryClient();

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const [showListingDetails, setShowListingDetails] = useState(true);
  const [showListingDetailsMobile, setShowListingDetailsMobile] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [newChat, setNewChatDetails] = useState({
    title: "",
    message: "",
    hostId: "",
    bookingId: "",
  });

  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ["messages-user"],
    queryFn: () => getMessagesByGuestId(userId),
    enabled: !!userId,
  });

  const { data: ticketDetails, isLoading: ticketLoading } = useQuery({
    queryKey: ["ticket-details", selectedConversation?.id],
    queryFn: () => getTicketMessages(selectedConversation!.id),
    enabled: !!selectedConversation,
  });

  const { data: bookingsData } = useQuery({
    queryKey: ["get-bookings"],
    queryFn: () => getBookingsByUserId(userId),
    enabled: !!userId,
  });

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      toast.success("Message sent successfully");
      queryClient.invalidateQueries({ queryKey: ["messages-user"] });

      setNewChatDetails({
        title: "",
        message: "",
        hostId: "",
        bookingId: "",
      });
    },
    onError: () => toast.error("Failed to send message"),
  });

  const conversations: Conversation[] = (conversationsData || []).map(
    (item: any) => ({
      id: item.id,
      guestName:
        `${item.hostFirstName || ""} ${item.hostLastName || ""}`.trim(),
      guestId: item.hostId,
      guestAvatar: item.hostPhoto,
      lastMessage: item.title || "",
      lastMessageTime: item.date ? new Date(item.date) : new Date(),
      unreadCount: item.unread || 0,
      propertyName: item.propertyTitle || "",
      propertyId: item.propertyId,
      propertyImage: item.propertyPhoto,
      propertyLocation: item.location,
      pricePerNight: item.price,
    }),
  );

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setShowListingDetails(true);
  };

  const handleNewChatChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "bookingId") {
      const booking = bookingsData?.find((b: any) => b.id === value);

      setNewChatDetails((prev) => ({
        ...prev,
        bookingId: value,
        hostId: booking?.property?.hostId || "",
      }));
    } else {
      setNewChatDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCreateTicket = (e: FormEvent) => {
    e.preventDefault();

    if (!newChat.title || !newChat.message || !newChat.hostId) {
      toast.error("Please fill all fields");
      return;
    }

    mutation.mutate({
      senderId: userId,
      userId: userId,
      message: newChat.message,
      hostId: newChat.hostId,
      title: newChat.title,
      bookingId: newChat.bookingId,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50">
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* HEADER */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Inbox</h1>
            </div>

            <div className="flex items-center gap-3">

              {/* SEARCH */}
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                />

                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* NEW MESSAGE */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center">
                    <Pencil size={18} />
                  </button>
                </DialogTrigger>

                <DialogContent>
                  <h4 className="text-lg font-semibold">New Chat</h4>

                  <form onSubmit={handleCreateTicket} className="space-y-4">

                    <Input
                      name="title"
                      placeholder="Topic"
                      value={newChat.title}
                      onChange={handleNewChatChange}
                    />

                    <textarea
                      name="message"
                      value={newChat.message}
                      onChange={handleNewChatChange}
                      className="w-full border rounded-md p-2"
                      rows={3}
                      placeholder="Message..."
                    />

                    <button
                      type="submit"
                      className="w-full bg-black text-white py-2 rounded-md"
                    >
                      Send
                    </button>

                  </form>
                </DialogContent>
              </Dialog>

            </div>
          </div>

          {/* MAIN */}
          <div className="flex flex-1 overflow-hidden">

            {/* CONVERSATIONS */}
            <div
              className={`${
                selectedConversation ? "hidden md:flex" : "flex"
              } w-full md:w-80 border-r bg-white flex-col`}
            >
              {isLoading ? (
                <div className="p-4 space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : (
                <MessageList
                  conversations={filteredConversations}
                  selectedConversationId={selectedConversation?.id}
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>

            {/* CHAT */}
            <div
              className={`${
                selectedConversation ? "flex" : "hidden md:flex"
              } flex-1 flex-col`}
            >

              {/* STICKY MOBILE BACK BAR */}
              {selectedConversation && (
                <div className="md:hidden sticky top-0 z-20 bg-white border-b p-3 flex justify-between">

                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="text-sm font-medium"
                  >
                    ← Back
                  </button>

                  <button
                    onClick={() => setShowListingDetailsMobile(true)}
                    className="text-sm text-red-600"
                  >
                    View listing
                  </button>

                </div>
              )}

              {selectedConversation ? (
                <ChatWindow conversation={selectedConversation} />
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  Select a conversation
                </div>
              )}

            </div>

          </div>
        </div>

        {/* DESKTOP LISTING PANEL */}
        {selectedConversation && showListingDetails && ticketDetails && (
          <div className="hidden lg:block w-80 border-l bg-white">
            <ListingDetails
              ticketData={ticketDetails}
              onClose={() => setShowListingDetails(false)}
            />
          </div>
        )}

      </div>

      {/* MOBILE LISTING SCREEN */}
      {showListingDetailsMobile && ticketDetails && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto">

          <div className="sticky top-0 bg-white border-b p-4">
            <button
              onClick={() => setShowListingDetailsMobile(false)}
              className="text-sm font-medium"
            >
              ← Back
            </button>
          </div>

          <ListingDetails
            ticketData={ticketDetails}
            onClose={() => setShowListingDetailsMobile(false)}
          />

        </div>
      )}
    </div>
  );
}