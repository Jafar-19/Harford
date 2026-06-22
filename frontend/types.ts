export interface Message {
    id: string;
    role: 'user' | 'agent' | 'system';
    text: string;
    timestamp: Date;
    isError?: boolean;
    attachmentName?: string;
}

export interface SessionData {
    id: string;
    app_name: string;
    userId: string;
}

export interface AgentResponseChunk {
    id: string;
    timestamp: string;
    author: string;
    content: {
        role: string;
        parts: Array<{ text: string }>;
    };
}