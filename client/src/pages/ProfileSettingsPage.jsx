import React, { useState } from 'react'
import Toggle from '../components/Toggle'

export default function ProfileSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [workspaceName, setWorkspaceName] = useState('')
  const [publicWorkspace, setPublicWorkspace] = useState(false)

  function handleSave(e) {
    e.preventDefault()
    // Front-end only: show a toast or update local state. Integrate API call if desired.
    alert('Settings saved (front-end demo)')
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">Profile Settings</h2>
        <p className="text-sm text-muted mt-1">Update your personal information</p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
          </div>

          <div>
            <label className="label">Email</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="label">Notifications</label>
              <div className="text-sm text-muted">Receive email notifications</div>
            </div>
            <Toggle id="notifications" checked={notifications} onChange={e=>setNotifications(e.target.checked)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">Workspace Settings</h2>
        <p className="text-sm text-muted mt-1">Configure workspace-specific options</p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="label">Workspace name</label>
            <input className="input" value={workspaceName} onChange={e=>setWorkspaceName(e.target.value)} placeholder="Acme Team" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="label">Public workspace</label>
              <div className="text-sm text-muted">Allow public access to workspace board</div>
            </div>
            <Toggle id="publicWorkspace" checked={publicWorkspace} onChange={e=>setPublicWorkspace(e.target.checked)} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" className="btn">Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}
