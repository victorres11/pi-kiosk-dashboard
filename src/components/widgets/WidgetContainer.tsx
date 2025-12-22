import type { ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import './WidgetContainer.css';

interface WidgetContainerProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  error?: string | null;
  lastUpdated?: Date | null;
  className?: string;
  minimal?: boolean;
}

export function WidgetContainer({
  title,
  icon,
  children,
  loading = false,
  error = null,
  lastUpdated,
  className = '',
  minimal = false,
}: WidgetContainerProps) {
  return (
    <div className={`widget-container ${className} ${minimal ? 'minimal' : ''}`}>
      {!minimal && (
        <div className="widget-header">
          <div className="widget-title">
            {icon && <span className="widget-icon">{icon}</span>}
            <h3>{title}</h3>
          </div>
          <div className="widget-status">
            {loading && <RefreshCw size={16} className="loading-spinner" />}
            {error && (
              <span className="error-indicator" title={error}>
                <AlertCircle size={16} />
              </span>
            )}
          </div>
        </div>
      )}

      <div className={`widget-content ${loading && !error ? 'loading' : ''}`}>
        {error && !loading ? (
          <div className="widget-error">
            <AlertCircle size={32} />
            <p>{error}</p>
            <p className="error-hint">Showing last available data</p>
          </div>
        ) : null}
        {children}
      </div>

      {!minimal && lastUpdated && (
        <div className="widget-footer">
          <span className="last-updated">
            Updated {format(lastUpdated, 'h:mm a')}
          </span>
        </div>
      )}
    </div>
  );
}
