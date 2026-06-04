import React from 'react'

export default function KPI({ title, value, subtitle, color = 'blue' }) {
  const cls = {
    blue: 'kpi kpi-blue',
    orange: 'kpi kpi-orange',
    green: 'kpi kpi-green',
    red: 'kpi kpi-red',
  }[color]

  return (
    <div className={`${cls}`}>
      <div className="text-sm text-gray-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">{value}</div>
      {subtitle && <div className="mt-1 text-sm text-gray-600">{subtitle}</div>}
    </div>
  )
}
