import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Upload, Trash2, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export const MethAIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading sessions:', error);
      return;
    }

    setSessions(data || []);
  };

  const loadSession = async (id: string) => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading session:', error);
      return;
    }

    setMessages(data.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.message,
      imageUrl: msg.image_url
    })));
    setSessionId(id);
    setShowHistory(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !uploadedImage) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      imageUrl: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    const imageToSend = uploadedImage;
    setUploadedImage(null);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('methai-chat', {
        body: {
          message: input,
          sessionId: sessionId,
          imageUrl: imageToSend
        }
      });

      if (error) throw error;

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message
      }]);

      if (!sessionId) {
        setSessionId(data.sessionId);
      }

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setUploadedImage(null);
    setShowHistory(false);
  };

  return (
    <>
   
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col animate-scale-in">
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">MethAI Assistant</h3>
            </div>
            <div className="flex gap-2">
              <Sheet open={showHistory} onOpenChange={setShowHistory}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary/90">
                    <History className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Chat History</SheetTitle>
                    <SheetDescription>
                      Your previous conversations
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-4 space-y-2">
                    <Button onClick={startNewChat} className="w-full" variant="outline">
                      New Chat
                    </Button>
                    {sessions.map((session) => (
                      <Button
                        key={session.id}
                        onClick={() => loadSession(session.id)}
                        variant="ghost"
                        className="w-full justify-start text-left"
                      >
                        <div className="truncate">
                          {session.title || 'Untitled chat'}
                        </div>
                      </Button>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Hi! I'm MethAI, your shopping assistant.</p>
                  <p className="text-xs mt-2">Ask me about products or upload an image!</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.imageUrl && (
                      <img 
                        src={message.imageUrl} 
                        alt="Uploaded" 
                        className="max-w-full rounded mb-2"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75" />
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            {uploadedImage && (
              <div className="mb-2 relative inline-block">
                <img src={uploadedImage} alt="Preview" className="max-h-20 rounded" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setUploadedImage(null)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about products..."
                disabled={isLoading}
              />
              <Button onClick={sendMessage} disabled={isLoading || (!input.trim() && !uploadedImage)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};
