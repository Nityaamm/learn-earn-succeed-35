
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from './ChatMessage';
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isBot: boolean;
}

const INITIAL_MESSAGE = "Hello! I'm your course assistant. I can help you with:
• Course information
• Study tips
• General questions
• Technical support

How can I help you today?";

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    { text: INITIAL_MESSAGE, isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simple response logic (this can be expanded with more sophisticated logic)
      const response = await getBotResponse(userMessage);
      setMessages(prev => [...prev, { text: response, isBot: true }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={index} 
            message={message.text} 
            isBot={message.isBot} 
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[50px] max-h-[100px]"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

// Simple response logic (can be enhanced with more sophisticated patterns)
const getBotResponse = async (message: string): Promise<string> => {
  const lowerMessage = message.toLowerCase();
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return "Our courses are priced based on their content and duration. Basic courses start from ₹1000, while advanced courses can go up to ₹10000. You'll get a refund based on your test performance!";
  }
  
  if (lowerMessage.includes('refund') || lowerMessage.includes('money back')) {
    return "Our unique refund system allows you to earn back up to 100% of your course fee based on your test performance. The higher you score on the final test, the more money you get back!";
  }
  
  if (lowerMessage.includes('test') || lowerMessage.includes('exam')) {
    return "Each course has a final test that evaluates your understanding. You can take the test once you've completed the course content. Your score on this test determines your refund amount!";
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! How can I help you today? Feel free to ask about our courses, pricing, or refund system!";
  }
  
  if (lowerMessage.includes('thank')) {
    return "You're welcome! If you have any more questions, feel free to ask.";
  }
  
  return "I understand you're asking about " + message + ". Could you please be more specific? I can help you with information about our courses, pricing, refund system, and final tests.";
};

export default ChatInterface;
