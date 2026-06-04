import React from 'react'

export default function StatusBadge({ status }) {
  // Use softer pastel backgrounds from design system
  const map = {
    Paid: { bg: 'var(--pastel-green)', color: '#065f46' },
    Overdue: { bg: 'var(--pastel-red)', color: '#7f1d1d' },
    Pending: { bg: 'var(--pastel-blue)', color: '#1e3a8a' },
  }
  const style = map[status] || { bg: 'var(--pastel-blue)', color: 'var(--ink)' }
  return (
    <span style={{ backgroundColor: style.bg, color: style.color }} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent">
      {status}
    </span>
  )
}
