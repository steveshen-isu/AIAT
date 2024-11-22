

import React, { useState, useEffect } from 'react';

function Typewriter({ text, speed = 150 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;

    const type = () => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    };

    const interval = setInterval(type, speed);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, speed]);

  return <span className="typewriter">{displayedText}</span>;
}

export default Typewriter;