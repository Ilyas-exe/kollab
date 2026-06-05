import React from 'react'

export default function StatusBadge({ status }) {
  const map = {
    Paid: 'badge-success',
    Done: 'badge-success',
    Delivered: 'badge-success',
    Active: 'badge-success',
    Overdue: 'badge-danger',
    Cancelled: 'badge-danger',
    Failed: 'badge-danger',
    Pending: 'badge-info',
    Sent: 'badge-info',
    'In Progress': 'badge-info',
    'In Transit': 'badge-warning',
    Draft: 'badge-neutral',
    'To Do': 'badge-neutral',
  }

  const cls = map[status] || 'badge-neutral';

  return (
    <span className={`${cls} inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold`}>
      {status}
    </span>
  )
}
