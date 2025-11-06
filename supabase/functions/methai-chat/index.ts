import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

interface ChatRequest {
  message: string;
  sessionId?: string;
  imageUrl?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId, imageUrl } = await req.json() as ChatRequest;
    
    if (!message) {
      throw new Error('Message is required');
    }
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get or create session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('chat_sessions')
        .insert({ title: message.substring(0, 50) })
        .select()
        .single();
      
      if (sessionError) throw sessionError;
      currentSessionId = newSession.id;
    }

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        message: message,
        role: 'user',
        image_url: imageUrl
      });

    // Get conversation history
    const { data: history } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', currentSessionId)
      .order('created_at', { ascending: true });

    // Build messages for AI
    const messages: any[] = [
      {
        role: 'system',
        content: 'You are MethAI, a helpful shopping assistant for DealShops. You help users find the best deals across Amazon, Myntra, and Meesho. Be friendly, concise, and helpful. When users upload images, describe them and help them find similar products.'
      }
    ];

    // Add conversation history
    for (const msg of history || []) {
      const content: any[] = [{ type: 'text', text: msg.message }];
      
      if (msg.image_url && msg.role === 'user') {
        content.push({
          type: 'image_url',
          image_url: { url: msg.image_url }
        });
      }
      
      messages.push({
        role: msg.role,
        content: content.length === 1 ? msg.message : content
      });
    }

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    // Save AI response
    await supabase
      .from('chat_messages')
      .insert({
        session_id: currentSessionId,
        message: aiMessage,
        role: 'assistant'
      });

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        sessionId: currentSessionId 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
