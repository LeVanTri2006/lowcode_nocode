import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './KpiCard.css';

interface KpiCardProps {
  label: string;
  value: string | number;
  subText?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconColor: string;
  iconBg?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subText,
  trend,
  icon: Icon,
  iconColor,
  iconBg,
}) => {
  const bg = iconBg || `${iconColor}15`;

  return (
    <div className="kpi-card ui-card">
      <div className="kpi-icon-wrap" style={{ backgroundColor: bg, color: iconColor }}>
        <Icon size={22} />
      </div>

      <div className="kpi-content">
        <span className="kpi-label">{label}</span>
        <span className="kpi-value">{value}</span>
        {subText && (
          <span className={`kpi-sub ${trend || ''}`}>
            {trend === 'up' && '↗ '}
            {trend === 'down' && '↘ '}
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};
