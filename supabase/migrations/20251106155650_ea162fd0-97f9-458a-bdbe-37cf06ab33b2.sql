-- Create chat_messages table for storing conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create chat_sessions table for organizing conversations
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add session_id to chat_messages
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON public.chat_sessions(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for chat_messages (public access for demo)
CREATE POLICY "Anyone can view chat messages" 
ON public.chat_messages FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert chat messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can delete their own messages" 
ON public.chat_messages FOR DELETE 
USING (true);

-- Create RLS policies for chat_sessions (public access for demo)
CREATE POLICY "Anyone can view chat sessions" 
ON public.chat_sessions FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert chat sessions" 
ON public.chat_sessions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update chat sessions" 
ON public.chat_sessions FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete chat sessions" 
ON public.chat_sessions FOR DELETE 
USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_chat_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON public.chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
BEFORE UPDATE ON public.chat_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_chat_session_timestamp();