import React, { useState, useCallback, useEffect } from 'react';
import { Building2, LogOut, Menu } from 'lucide-react';
import { AuthScreen } from './components/AuthScreen';
import { ChatInterface } from './components/ChatInterface';
import { FAQSidebar } from './components/FAQSidebar';
import { Message, SessionData } from './types';
import { createSession, streamQuery, fileToBase64 } from './services/agentService';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState('');
    const [session, setSession] = useState<SessionData | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    const handleLogin = async (mobile: string) => {
        setAuthLoading(true);
        try {
            // In a real app, verify OTP here. We proceed to create ADK session.
            const sessionData = await createSession(mobile);
            setSession(sessionData);
            setUserId(mobile);
            setIsAuthenticated(true);
            
            // Trigger initial greeting from agent
            handleSendMessage("Hello, I would like to check my loan account details.", undefined, sessionData.id, mobile);
        } catch (error) {
            console.error("Login failed:", error);
            alert("Failed to connect to the secure server. Please try again later.");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setSession(null);
        setUserId('');
        setMessages([]);
    };

    const handleSendMessage = useCallback(async (text: string, file?: File, currentSessionId?: string, currentUserId?: string) => {
        const activeSessionId = currentSessionId || session?.id;
        const activeUserId = currentUserId || userId;

        if (!activeSessionId || !activeUserId) {
            console.error("No active session");
            return;
        }

        const userMsgId = Date.now().toString();
        const newUserMessage: Message = {
            id: userMsgId,
            role: 'user',
            text: text || (file ? 'Uploaded a document' : ''),
            timestamp: new Date(),
            attachmentName: file?.name
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        try {
            let messagePayload: any = text;

            if (file) {
                const base64Data = await fileToBase64(file);
                messagePayload = {
                    role: "user",
                    parts: [
                        { text: text || `Please review this document: ${file.name}` },
                        {
                            inlineData: {
                                mimeType: file.type || 'application/octet-stream',
                                data: base64Data
                            }
                        }
                    ]
                };
            }

            const agentMsgId = (Date.now() + 1).toString();
            
            // Add an empty agent message that we will update via streaming
            setMessages(prev => [...prev, {
                id: agentMsgId,
                role: 'agent',
                text: '',
                timestamp: new Date()
            }]);

            await streamQuery(activeSessionId, activeUserId, messagePayload, (chunkText) => {
                setMessages(prev => prev.map(msg => 
                    msg.id === agentMsgId ? { ...msg, text: chunkText } : msg
                ));
            });

        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                text: 'Sorry, I encountered an error processing your request. Please try again.',
                timestamp: new Date(),
                isError: true
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [session, userId]);

    if (!isAuthenticated) {
        return <AuthScreen onLogin={handleLogin} isLoading={authLoading} />;
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Nexus Bank</h1>
                        <p className="text-xs text-slate-500">Secure Resolution Portal</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setIsFaqOpen(!isFaqOpen)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center"
                        title="Help & FAQs"
                    >
                        <Menu className="w-5 h-5 md:hidden" />
                        <span className="hidden md:inline-block text-sm font-medium mr-1">FAQs</span>
                    </button>
                    <div className="h-6 w-px bg-slate-200 mx-2"></div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">End Session</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden relative">
                <ChatInterface 
                    messages={messages} 
                    onSendMessage={handleSendMessage} 
                    isTyping={isTyping} 
                />
                
                {/* Overlay for mobile when sidebar is open */}
                {isFaqOpen && (
                    <div 
                        className="absolute inset-0 bg-slate-900/20 z-10 md:hidden"
                        onClick={() => setIsFaqOpen(false)}
                    />
                )}
                
                <FAQSidebar isOpen={isFaqOpen} onClose={() => setIsFaqOpen(false)} />
            </main>
        </div>
    );
};

export default App;
