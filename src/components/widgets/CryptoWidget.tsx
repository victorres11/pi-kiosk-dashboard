import { TrendingUp, TrendingDown, Bitcoin } from 'lucide-react';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchCryptoData } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { CryptoData, CryptoPrice } from '../../types';
import './CryptoWidget.css';

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  } else if (price >= 1) {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  }
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  }
  return `$${marketCap.toLocaleString()}`;
}

function CryptoCard({ crypto }: { crypto: CryptoPrice }) {
  const isPositive = crypto.changePercent24h >= 0;

  return (
    <div className="crypto-card">
      <div className="crypto-header">
        <span className="crypto-symbol">{crypto.symbol}</span>
        <span className="crypto-name">{crypto.name}</span>
      </div>
      <div className="crypto-price">{formatPrice(crypto.price)}</div>
      <div className={`crypto-change ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{isPositive ? '+' : ''}{crypto.changePercent24h.toFixed(2)}%</span>
      </div>
      <div className="crypto-market-cap">
        MCap: {formatMarketCap(crypto.marketCap)}
      </div>
    </div>
  );
}

export function CryptoWidget() {
  const { data, loading, error, lastUpdated } = useDataFetcher<CryptoData>({
    fetchFn: fetchCryptoData,
    refreshInterval: config.refreshIntervals.crypto,
    enabled: config.widgets.weather, // Tied to weather widget visibility
  });

  return (
    <WidgetContainer
      title="Crypto"
      icon={<Bitcoin size={24} />}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      className="crypto-widget"
    >
      {data && (
        <div className="crypto-grid">
          {data.prices.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      )}
    </WidgetContainer>
  );
}
