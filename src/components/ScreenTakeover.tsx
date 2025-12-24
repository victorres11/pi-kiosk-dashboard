import { useState, useEffect } from 'react';
import './ScreenTakeover.css';
import logoLight from '../assets/vtSportsSolutions-light.png';
import andresImg from '../assets/screentakeoverImages/andres.jpg';

// TEST MODE: Just show the andres.jpg image
const TAKEOVER_INTERVAL = 120000; // 2 minutes
const TAKEOVER_DURATION = 10000; // 10 seconds

export function ScreenTakeover() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const triggerTakeover = () => {
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

  if (!isActive) return null;

  return (
    <div className={`screen-takeover ${isActive ? 'active' : ''}`}>
      <div className="takeover-content">
        <div className="takeover-gif">
          <img src={andresImg} alt="Andres" className="gif-image" />
        </div>
      </div>

      {/* Logo watermark */}
      <img src={logoLight} alt="VT Sport Solutions" className="takeover-logo" />
    </div>
  );
}
