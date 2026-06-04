import React from 'react'

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={onPrev} className="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm">Préc</button>
      <div className="px-3 py-1 text-sm">{page} / {totalPages}</div>
      <button onClick={onNext} className="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm">Suiv</button>
    </div>
  )
}
