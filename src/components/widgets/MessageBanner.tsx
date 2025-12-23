import { useState, useEffect } from 'react';
import './MessageBanner.css';

interface Message {
  id: string;
  text: string;
  icon?: 'heart' | 'star' | 'info';
}

// Add your messages here - they'll rotate if there are multiple
const messages: Message[] = [
  {
    id: '1',
    text: "Welcome, Andrés! Remember to wash your hands after going to the bathroom",
    icon: 'info',
  },
];

const ROTATION_INTERVAL = 30000; // 30 seconds per message

export function MessageBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const currentMessage = messages[currentIndex];

  if (!currentMessage) return null;

  return (
    <div className="message-banner">
      <div className="message-content">
        <span className="message-text">{currentMessage.text}</span>
      </div>
    </div>
  );
}
