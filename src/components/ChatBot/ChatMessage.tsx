
import React from 'react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

const ChatMessage = ({ message, isBot }: ChatMessageProps) => {
  return (
    <div className={cn("flex w-full gap-2 mb-4", 
      isBot ? "justify-start" : "justify-end"
    )}>
      {isBot && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="/bot-avatar.png" />
          <AvatarFallback>BOT</AvatarFallback>
        </Avatar>
      )}
      <Card className={cn("max-w-[80%]",
        isBot ? "bg-secondary" : "bg-primary text-primary-foreground"
      )}>
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message}</p>
        </CardContent>
      </Card>
      {!isBot && (
        <Avatar className="w-8 h-8">
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
