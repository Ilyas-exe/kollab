import React from 'react'

export default function KPI({ title, value, subtitle, color = 'blue', icon }) {
  const colorMap = {
    blue: { bg: 'bg-pastel-blue', iconBg: 'kpi-icon-blue' },
    orange: { bg: 'bg-pastel-orange', iconBg: 'kpi-icon-orange' },
    green: { bg: 'bg-pastel-green', iconBg: 'kpi-icon-green' },
    red: { bg: 'bg-pastel-red', iconBg: 'kpi-icon-red' },
    purple: { bg: 'bg-pastel-purple', iconBg: 'kpi-icon-purple' },
  }

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="card-kpi">
      <div className="flex items-center justify-between">
        <div>
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{value}</p>
          {subtitle && <p className="kpi-subtitle">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`kpi-icon ${c.iconBg}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
