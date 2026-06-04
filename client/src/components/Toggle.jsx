import React from 'react'

export default function Toggle({ checked, onChange, id }) {
  return (
    <label htmlFor={id} className="inline-flex items-center cursor-pointer">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors ${checked ? 'bg-accent' : 'bg-gray-200'}`}>
        <div className={`bg-white w-4 h-4 rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
      </div>
    </label>
  )
}
