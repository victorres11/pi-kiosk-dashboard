import { useState, useEffect } from 'react';
import './ScreenTakeover.css';

type TakeoverType = 'quote' | 'gif' | 'did-you-know' | 'this-day';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
];

const didYouKnowFacts = [
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still edible.",
  "Octopuses have three hearts and blue blood.",
  "A group of flamingos is called a 'flamboyance'.",
  "The shortest war in history lasted 38 minutes between Britain and Zanzibar.",
  "Bananas are berries, but strawberries aren't.",
  "A day on Venus is longer than a year on Venus.",
  "Cows have best friends and get stressed when separated.",
  "The inventor of the Pringles can is buried in one.",
  "There are more possible iterations of a game of chess than atoms in the observable universe.",
  "Sharks are older than trees. Sharks have been around for 400 million years, trees for 350 million.",
  "A jiffy is an actual unit of time: 1/100th of a second.",
  "The heart of a shrimp is located in its head.",
  "Scotland's national animal is the unicorn.",
  "Hot water freezes faster than cold water. This is called the Mpemba effect.",
  "A cloud can weigh more than a million pounds.",
  "Wombat poop is cube-shaped.",
  "The moon has moonquakes.",
  "Your brain uses about 20% of your body's total energy.",
];

// This day in history events by month-day
const thisDayInHistory: Record<string, string[]> = {
  "12-22": [
    "1894: French army captain Alfred Dreyfus convicted of treason in a wrongful verdict",
    "1965: A 70 mph speed limit was set on US highways",
    "1989: Brandenburg Gate opens after 28 years of Berlin Wall division",
  ],
  "12-23": [
    "1823: 'A Visit from St. Nicholas' poem first published",
    "1947: Transistor invented at Bell Labs",
    "1986: Voyager aircraft completes first non-stop flight around the world",
  ],
  "12-24": [
    "1818: 'Silent Night' performed for the first time in Austria",
    "1968: Apollo 8 astronauts become first humans to orbit the Moon",
    "1979: First Ariane rocket launched by European Space Agency",
  ],
  "12-25": [
    "1776: George Washington crosses the Delaware River",
    "1991: Mikhail Gorbachev resigns as Soviet President",
    "2021: James Webb Space Telescope launched",
  ],
  "12-26": [
    "1865: James Nason patents the coffee percolator",
    "1933: FM radio patented by Edwin Armstrong",
    "2004: Indian Ocean earthquake and tsunami kills over 230,000",
  ],
  "12-27": [
    "1831: Charles Darwin sets sail on HMS Beagle",
    "1945: World Bank established",
    "1979: Soviet invasion of Afghanistan begins",
  ],
  "12-28": [
    "1895: First commercial movie screening by Lumière brothers",
    "1973: Endangered Species Act signed into law",
    "2014: AirAsia Flight 8501 crashes into Java Sea",
  ],
  "12-29": [
    "1845: Texas admitted as 28th US state",
    "1890: Wounded Knee Massacre occurs",
    "1989: Vaclav Havel elected president of Czechoslovakia",
  ],
  "12-30": [
    "1922: USSR officially established",
    "1927: First subway in Asia opens in Tokyo",
    "2006: Saddam Hussein executed in Baghdad",
  ],
  "12-31": [
    "1879: Thomas Edison demonstrates incandescent light",
    "1999: Boris Yeltsin resigns as Russian President",
    "1999: Panama takes control of Panama Canal",
  ],
  "1-1": [
    "1863: Emancipation Proclamation takes effect",
    "1959: Fidel Castro takes power in Cuba",
    "2002: Euro currency introduced in 12 European countries",
  ],
};

// Giphy API - using public beta key for demo purposes
const GIPHY_API_KEY = 'dc6zaTOxFJmzC'; // Public beta key
const gifSearchTerms = ['funny celebration', 'happy dance', 'excited', 'sports celebration', 'cute animals', 'funny fails', 'victory dance', 'mind blown'];

const TAKEOVER_INTERVAL = 120000; // 2 minutes
const TAKEOVER_DURATION = 10000; // 10 seconds

export function ScreenTakeover() {
  const [isActive, setIsActive] = useState(false);
  const [takeoverType, setTakeoverType] = useState<TakeoverType>('quote');
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const triggerTakeover = async () => {
      // Pick random type
      const types: TakeoverType[] = ['quote', 'gif', 'did-you-know', 'this-day'];
      const type = types[Math.floor(Math.random() * types.length)];

      setTakeoverType(type);

      // Set content based on type
      switch (type) {
        case 'quote':
          setContent(quotes[Math.floor(Math.random() * quotes.length)]);
          break;
        case 'gif':
          try {
            const searchTerm = gifSearchTerms[Math.floor(Math.random() * gifSearchTerms.length)];
            const response = await fetch(
              `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=25&rating=g`
            );
            const data = await response.json();
            if (data.data && data.data.length > 0) {
              const randomGif = data.data[Math.floor(Math.random() * data.data.length)];
              setContent({
                url: randomGif.images.original.url,
                title: randomGif.title,
              });
            }
          } catch (err) {
            console.warn('Failed to fetch GIF:', err);
            // Fallback to quote if GIF fails
            setTakeoverType('quote');
            setContent(quotes[Math.floor(Math.random() * quotes.length)]);
          }
          break;
        case 'did-you-know':
          setContent(didYouKnowFacts[Math.floor(Math.random() * didYouKnowFacts.length)]);
          break;
        case 'this-day':
          const today = new Date();
          const monthDay = `${today.getMonth() + 1}-${today.getDate()}`;
          const events = thisDayInHistory[monthDay] || [
            "1903: Wright Brothers make first powered flight at Kitty Hawk",
            "1969: Neil Armstrong walks on the Moon",
            "1989: World Wide Web invented by Tim Berners-Lee",
          ];
          setContent(events[Math.floor(Math.random() * events.length)]);
          break;
      }

      setIsActive(true);

      // Hide after duration
      setTimeout(() => {
        setIsActive(false);
      }, TAKEOVER_DURATION);
    };

    // Initial delay before first takeover (30 seconds)
    const initialTimeout = setTimeout(triggerTakeover, 30000);

    // Regular interval
    const interval = setInterval(triggerTakeover, TAKEOVER_INTERVAL);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  if (!isActive || !content) return null;

  return (
    <div className={`screen-takeover ${isActive ? 'active' : ''}`}>
      <div className="takeover-content">
        {takeoverType === 'quote' && (
          <div className="takeover-quote">
            <div className="quote-icon">"</div>
            <div className="quote-text">{content.text}</div>
            <div className="quote-author">— {content.author}</div>
          </div>
        )}

        {takeoverType === 'gif' && (
          <div className="takeover-gif">
            <img src={content.url} alt={content.title} className="gif-image" />
          </div>
        )}

        {takeoverType === 'did-you-know' && (
          <div className="takeover-fact">
            <div className="fact-label">Did You Know?</div>
            <div className="fact-text">{content}</div>
          </div>
        )}

        {takeoverType === 'this-day' && (
          <div className="takeover-history">
            <div className="history-label">This Day in History</div>
            <div className="history-event">{content}</div>
          </div>
        )}
      </div>
    </div>
  );
}
