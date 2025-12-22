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
    text: "Hello Addy, please remember to cook dinner. Make it with love and not too late because it's not good to eat late",
    icon: 'heart',
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
