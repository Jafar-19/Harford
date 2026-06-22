import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Bot, User, FileText, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types.ts';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (text: string, file?: File) => void;
    isTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isTyping }) => {
    const [inputText, setInputText] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() && !selectedFile) return;
        
        onSendMessage(inputText, selectedFile || undefined);
        setInputText('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white h-full relative">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <Bot className="w-16 h-16 text-slate-200" />
                        <p>Initializing secure connection...</p>
                    </div>
                )}
                
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            
                            {/* Avatar */}
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                                msg.role === 'user' ? 'bg-blue-100 ml-3' : 
                                msg.role === 'system' ? 'bg-red-100 mr-3' : 'bg-slate-800 mr-3'
                            }`}>
                                {msg.role === 'user' ? <User className="w-5 h-5 text-blue-600" /> : 
                                 msg.role === 'system' ? <AlertCircle className="w-5 h-5 text-red-600" /> :
                                 <Bot className="w-5 h-5 text-white" />}
                            </div>

                            {/* Message Content */}
                            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                                    msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 
                                    msg.role === 'system' ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-sm' :
                                    'bg-slate-100 text-slate-800 rounded-tl-sm'
                                }`}>
                                    {msg.attachmentName && (
                                        <div className="flex items-center space-x-2 mb-2 p-2 bg-black/10 rounded-lg text-sm">
                                            <FileText className="w-4 h-4" />
                                            <span className="truncate max-w-[200px]">{msg.attachmentName}</span>
                                        </div>
                                    )}
                                    
                                    {msg.role === 'user' ? (
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    ) : (
                                        <div className="markdown-body text-sm md:text-base">
                                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs text-slate-400 mt-1 px-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex justify-start">
                        <div className="flex flex-row max-w-[80%]">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mt-1 mr-3">
                                <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div className="bg-slate-100 px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
                {selectedFile && (
                    <div className="mb-3 flex items-center justify-between bg-blue-50 text-blue-800 px-3 py-2 rounded-lg border border-blue-100">
                        <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm truncate">{selectedFile.name}</span>
                        </div>
                        <button 
                            onClick={() => { setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="text-blue-500 hover:text-blue-700 ml-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex items-end space-x-2">
                    <div className="flex-1 relative bg-slate-50 border border-slate-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Type your message..."
                            className="w-full max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 pl-4 pr-12 text-slate-800"
                            rows={1}
                        />
                        <div className="absolute right-2 bottom-2 flex items-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Attach document"
                            >
                                <Paperclip className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={(!inputText.trim() && !selectedFile) || isTyping}
                        className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
                <div className="text-center mt-2 text-xs text-slate-400">
                    Press Enter to send, Shift+Enter for new line
                </div>
            </div>
        </div>
    );
};

// Need to import X here since it's used in the selected file badge
import { X } from 'lucide-react';
