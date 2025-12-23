import { useState, useEffect } from 'react';
import { WeatherWidget } from './WeatherWidget';
import { CryptoWidget } from './CryptoWidget';
import { config } from '../../config/dashboard.config';
import './WeatherCryptoWidget.css';

export function WeatherCryptoWidget() {
  const [showCrypto, setShowCrypto] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCrypto((prev) => !prev);
    }, config.crypto.rotationInterval);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="weather-crypto-container">
      <div className={`widget-panel ${showCrypto ? 'hidden' : 'visible'}`}>
        <WeatherWidget />
      </div>
      <div className={`widget-panel ${showCrypto ? 'visible' : 'hidden'}`}>
        <CryptoWidget />
      </div>
    </div>
  );
}
