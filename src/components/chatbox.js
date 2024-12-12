import React, { useState, useEffect, memo } from 'react';
import 'C:/Users/ROG/node_modules/katex/dist/katex.min.css';
import katex from 'katex';
import Typewriter from './Typewriter';
import TypewriterResponse from './TypeWriterResponse';
const currentUrl = window.location.href;

const ipAddress = currentUrl.split(':')[1].split('/')[2];
function ChatBox() {
    const [message, setMessage] = useState('');
    const [responses, setResponses] = useState([]);
    const [pastedImage, setPastedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message && !pastedImage) return;

        setLoading(true);
        try {
            const fullConversation = [
                ...responses.map((item) => [
                    { role: 'user', content: item.query },
                    { role: 'assistant', content: item.response },
                ]).flat(),
                { role: 'user', content: message },

            ];

            const requestBody = {
                conversation: fullConversation,
                image: pastedImage,
            };

            const response = await fetch('http://' + ipAddress + ':200/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();
            setResponses((prev) => [
                ...prev,
                { query: message, response: data.response },
            ]);
            setMessage('');
            setPastedImage(null);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }

    };



    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();

                reader.onload = (e) => {
                    setPastedImage(e.target.result);
                };

                reader.readAsDataURL(file);
                break;
            }
        }
    };

    const removeImage = () => {
        setPastedImage(null);
    };
    return (
        <div className="flex flex-col h-144 bg-gray-100">
            {/* Chat container */}
            <div className="flex-1 overflow-y-auto p-4 mb-4">
                {/* Displaying conversation */}
                {responses.map((item, index) => (
                    <div key={index} className="mb-4 w-full max-w-6x1 flex-row-reverse justify-start">
                        <div className="flex items-start space-x-4">
                            {/* User message */}
                            <div className="flex flex-col items-end justify-end" >
                                <div className="bg-blue-500 text-white p-2 rounded-lg max-w-xs">
                                <p><b>You:</b></p>
                <div 
                    className="prose" 
                    dangerouslySetInnerHTML={{ __html: item.query }} 
                />                                </div>

                            </div>

                            {/* GPT response */}

                            <div className="max-w-4x1 bg-gray-600 p-4 rounded-lg shadow-lg text-right ml-auto">

                                <p><b>GPT:</b>
                                    <TypewriterResponse content={item.response} />
                                </p>
                            </div>
                            {item.responseImage && (
                                <img
                                    src={item.responseImage}
                                    alt="GPT response image"
                                    className="max-w-xs mt-2 rounded-lg"
                                />
                            )}

                        </div>
                    </div>
                ))}

                {/* Display pasted image (if any) */}

            </div>

            {/* Message input (always at the bottom) */}
            <div className="flex items-center space-x-4 p-4 border-t border-gray-300 bg-white">
            <textarea
    className="!custom-textarea p-4 bg-white border border-gray-300 rounded-lg w-1/2 max-w-3x1 resize-none !text-sm placeholder-gray-500"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onPaste={handlePaste}
    rows="3"  // Increasing the rows for a larger box
    placeholder="Type your message or paste an image..."
 />

                <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="bg-blue-500 text-white p-3 rounded-full disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>

                {pastedImage && (
                    <div className="flex items-center space-x-4 mt-4 ml-4">
                        <div className="flex flex-col items-end">

                            <img
                                src={pastedImage}
                                alt="Pasted content"
                                className="max-w-xs h-auto mt-2 rounded-lg"
                            />
                            <button
                                onClick={() => setPastedImage(null)}
                                className="bg-red-500 text-white p-2 mt-2 rounded-lg"
                            >
                                Remove Image
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );


}

export default ChatBox;
