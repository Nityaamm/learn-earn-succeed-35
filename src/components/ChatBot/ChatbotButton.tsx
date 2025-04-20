
import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ChatInterface from './ChatInterface';

const ChatbotButton = () => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full h-12 w-12">
            <MessageSquare />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] sm:w-[440px] h-[600px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Course Assistant</SheetTitle>
          </SheetHeader>
          <ChatInterface />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatbotButton;
