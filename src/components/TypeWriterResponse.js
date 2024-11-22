import React, { useState, useEffect, memo } from 'react';
import 'C:/Users/ROG/node_modules/katex/dist/katex.min.css';
import katex from 'katex';





    

    
    const typewriterEffectResponse = async (content, setDisplayContent) => {
        let isMounted = true;
        content = content.replace(/\\\[\s*/g, '\\[');  // Replace \[ with \( and remove leading spaces
        content = content.replace(/\s*\\\]/g, '\\]');  // Replace \] with \) and remove trailing spaces
        console.log(content);
        const regex = /(\\\(.*?\\\))|(\\\[[\s\S]*?\\\])|(\\begin\{array\}[\s\S]*?\\end\{array\})|(\\textit\{.*?\})|(\\textbf\{.*?\})/g;
        const parts = content.split(regex).filter(part => part !== null && part !== undefined && part !== '');
        let displayContent = '';
        console.log(parts);
        for (const part of parts) {
            if (part.startsWith('\\(') || part.startsWith('\\[') || part.startsWith('\\begin') || part.startsWith('\\textit') || part.startsWith('\\textbf')) {
                // Process LaTeX content

                try {
                    const isDisplayMode = part.startsWith('\\[');
                    const mathContent = part.replace(/\\[\(\[\)\]]/g, '');  // Strip the delimiters
                    const renderedMath = katex.renderToString(mathContent, { throwOnError: false, displayMode: isDisplayMode });

                    // Simulate typing the LaTeX
                    for (let i = 0; i < renderedMath.length; i++) {
                        displayContent += renderedMath[i];


                        if (isMounted) setDisplayContent(displayContent);
/*                     await delayRandomTime(); 
 */                }
                } catch (e) {
                    console.error('Error rendering LaTeX:', e);
                    displayContent += `<span class="error">Failed to render LaTeX: ${part}</span>`;
                    if (isMounted) setDisplayContent(displayContent);
                }
            } else {
                // Process plain text content
                for (let i = 0; i < part.length; i++) {
                    displayContent += part[i] === '\n' ? '<br />' : part[i];
                    if (isMounted) setDisplayContent(displayContent);
                    await textdelayRandomTime();
                }
            }
        }
    };


    const textdelayRandomTime = () => {
        return new Promise(resolve => {
            const randomDelay = Math.floor(Math.random() * 20) + 5; // Delay between 50ms to 250ms
            setTimeout(resolve, randomDelay);
        });
    };

    // Main component to handle the content rendering



    const TypewriterRendererResponse = memo(({ content }) => {
        const [displayContent, setDisplayContent] = useState('');

        useEffect(() => {
            let isMounted = true;
            // Start the typewriter effect when the component loads

            setDisplayContent(''); // Reset before running
            typewriterEffectResponse(content, setDisplayContent);
            return () => {
                isMounted = false;
            }
        }, [content]);

        return (
            <div>
                <div
                    style={{
                        textAlign: 'left',         // Align text to the left
                        width: '60vw',
                        margin: '0 auto',          // Center the div horizontally
                        padding: '10px',           // Add padding
                        maxWidth: '1300px',         // Set a max width for the container
                        marginLeft: '1vw',        // Add some space from the left
                        border: '0px solid gray',  // Gray border
                        backgroundColor: 'black',  // Black background
                        color: 'white',            // White text color for contrast
                        fontFamily: 'Segoe UI, sans-serif',  // Font family
                        fontSize: '18px',          // Font size
                        fontWeight: 'lighter',        // Bold text
                        fontStyle: 'normal',       // Italic text
                        lineHeight: '1.6',         // Line height for readability
                        letterSpacing: '1px'       // Space between letters
                    }}
                    dangerouslySetInnerHTML={{ __html: displayContent }}
                />
            </div>
        );
    });
    export default TypewriterRendererResponse;