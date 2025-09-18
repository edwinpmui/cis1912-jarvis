export interface ChatListResponse {
    id: number;
    title: string;
    user_id: string;
    created_at: string;
    message_count?: number;
}

export interface ChatCreate {
    title: string;
}

export interface ChatResponse {
    id: number;
    title: string;
    user_id: string;
    created_at: string;
    messages: MessageResponse[];
}

export interface MessageCreate {
    content: string;
    role: 'user' | 'assistant';
    response_id?: string;
    status?: 'complete' | 'generating' | 'error';
    extra_data?: Record<string, any>;
}

export interface MessageResponse {
    id: number;
    chat_id: number;
    content: string;
    role: 'user' | 'assistant';
    response_id?: string;
    status: 'complete' | 'generating' | 'error';
    extra_data?: Record<string, any>;
    created_at: string;
}

export interface QuickChatRequest {
    message: string;
}