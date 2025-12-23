import { Activity, ArrowDown, ArrowUp } from 'lucide-react';
import { useDataFetcher } from '../../hooks/useDataFetcher';
import { fetchNetworkBandwidth } from '../../utils/api';
import { config } from '../../config/dashboard.config';
import { WidgetContainer } from './WidgetContainer';
import type { NetworkBandwidthData, NetworkDevice } from '../../types';
import './NetworkWidget.css';

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format bytes per second to speed string
 */
function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec === 0) return '0 B/s';
  const k = 1024;
  const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  const i = Math.floor(Math.log(bytesPerSec) / Math.log(k));
  return parseFloat((bytesPerSec / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Speed indicator showing download/upload rates
 */
function SpeedIndicator({ download, upload }: { download: number; upload: number }) {
  return (
    <div className="speed-indicator">
      <div className="speed-row download">
        <ArrowDown size={18} className="speed-icon" />
        <span className="speed-value">{formatSpeed(download)}</span>
      </div>
      <div className="speed-row upload">
        <ArrowUp size={18} className="speed-icon" />
        <span className="speed-value">{formatSpeed(upload)}</span>
      </div>
    </div>
  );
}

/**
 * Single device card in the top devices list
 */
function DeviceCard({ device, rank }: { device: NetworkDevice; rank: number }) {
  const displayName = device.hostname || device.ip;
  const totalBytes = device.download + device.upload;

  return (
    <div className="device-card">
      <span className="device-rank">#{rank}</span>
      <div className="device-info">
        <span className="device-name" title={`${device.ip} (${device.mac})`}>
          {displayName}
        </span>
        <span className="device-usage">
          {totalBytes > 0 ? formatBytes(totalBytes) : 'Active'}
        </span>
      </div>
    </div>
  );
}

export function NetworkWidget() {
  const { data, loading, error, lastUpdated } = useDataFetcher<NetworkBandwidthData>({
    fetchFn: fetchNetworkBandwidth,
    refreshInterval: config.refreshIntervals.network,
    enabled: config.widgets.network,
  });

  return (
    <WidgetContainer
      title="Network"
      icon={<Activity size={20} />}
      loading={loading}
      error={error}
      lastUpdated={lastUpdated}
      className="network-widget"
    >
      {data && (
        <div className="network-content">
          {/* Current Speed */}
          <div className="current-speed-section">
            <SpeedIndicator
              download={data.currentRates.download}
              upload={data.currentRates.upload}
            />
          </div>

          {/* Usage Summary */}
          <div className="usage-summary">
            <div className="usage-item">
              <span className="usage-label">Today</span>
              <span className="usage-value">
                {formatBytes(data.today.download + data.today.upload)}
              </span>
            </div>
            <div className="usage-item">
              <span className="usage-label">Month</span>
              <span className="usage-value">
                {formatBytes(data.month.download + data.month.upload)}
              </span>
            </div>
          </div>

          {/* Top Devices */}
          {data.topDevices.length > 0 && (
            <div className="top-devices-section">
              <h4 className="section-title">Active Devices</h4>
              <div className="devices-list">
                {data.topDevices
                  .slice(0, config.network.showTopDevices)
                  .map((device, index) => (
                    <DeviceCard
                      key={device.mac}
                      device={device}
                      rank={index + 1}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </WidgetContainer>
  );
}
