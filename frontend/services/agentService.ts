import { SessionData } from '../types.ts';

const AGENT_ID = 'projects/905482569530/locations/us-central1/reasoningEngines/3477595299713646592';
const LOCATION = 'us-central1';
const BASE_URL = `https://${LOCATION}-aiplatform.googleapis.com/v1/${AGENT_ID}`;

export const createSession = async (userId: string): Promise<SessionData> => {
    try {
        const response = await fetch(`${BASE_URL}:query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Assuming authentication is handled externally as per instructions
            },
            body: JSON.stringify({
                classMethod: 'async_create_session',
                input: { user_id: userId }
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`);
        }

        const data = await response.json();
        return data.output as SessionData;
    } catch (error) {
        console.error("Error creating session:", error);
        throw error;
    }
};

export const streamQuery = async (
    sessionId: string,
    userId: string,
    messageContent: any,
    onChunk: (text: string) => void
): Promise<void> => {
    try {
        const response = await fetch(`${BASE_URL}:streamQuery`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                classMethod: 'async_stream_query',
                input: {
                    user_id: userId,
                    session_id: sessionId,
                    message: messageContent
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Stream query failed: ${response.statusText}`);
        }

        if (!response.body) {
            throw new Error("Response body is null");
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        // Using for await...of as requested for streaming
        for await (const chunk of response.body as any) {
            buffer += decoder.decode(chunk, { stream: true });
            
            // Process NDJSON (Newline Delimited JSON)
            const lines = buffer.split('\n');
            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const data = JSON.parse(line);
                        if (data.content && data.content.parts && data.content.parts.length > 0) {
                            const newText = data.content.parts[0].text;
                            if (newText) {
                                fullText += newText;
                                onChunk(fullText);
                            }
                        }
                    } catch (e) {
                        console.warn("Failed to parse JSON chunk line:", line, e);
                    }
                }
            }
        }
        
        // Process any remaining data in buffer
        if (buffer.trim()) {
             try {
                const data = JSON.parse(buffer);
                if (data.content && data.content.parts && data.content.parts.length > 0) {
                    const newText = data.content.parts[0].text;
                    if (newText) {
                        fullText += newText;
                        onChunk(fullText);
                    }
                }
            } catch (e) {
                // Ignore final parse error if it's just empty space
            }
        }

    } catch (error) {
        console.error("Error in streamQuery:", error);
        throw error;
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};
