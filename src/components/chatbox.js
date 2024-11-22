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
                { role: 'user', content: message }, // Add the current message as the latest user input
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
        <div>
            <h1>
                <Typewriter text="Talk to me about your question or copy your image including your question" speed={20} />
            </h1>

            <textarea
                className="custom-textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onPaste={handlePaste}
                rows="4"
                cols="50"
                placeholder="Type your message or paste an image..."
            />

            {pastedImage && (
                <div>
                    <h1>
                        <Typewriter text="pasted image:" speed={20} />
                    </h1>
                    <img src={pastedImage} alt="Pasted content" style={{ maxWidth: '100%', height: 'auto' }} />
                    <button onClick={removeImage} style={{ marginTop: '10px' }}>Remove Pasted Image</button>
                </div>
            )}

            <button onClick={sendMessage} disabled={loading} style={{ marginTop: '10px' }}>
                {loading ? 'Sending...' : 'Send'}
            </button>

            <div>
                {responses.map((item, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <p><b>You:</b>
                            <TypewriterResponse content={item.query} />
                        </p>
                        <p><b>GPT:</b>                         <div>
                            <TypewriterResponse content={item.response} />
                        </div></p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatBox;
