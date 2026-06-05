import React from 'react'

export default function Toggle({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-accent' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}
