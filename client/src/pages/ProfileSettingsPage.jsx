import React, { useState } from 'react'
import Toggle from '../components/Toggle'

export default function ProfileSettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [workspaceName, setWorkspaceName] = useState('')
  const [publicWorkspace, setPublicWorkspace] = useState(false)
  const [activeSection, setActiveSection] = useState('profile')

  function handleSave(e) {
    e.preventDefault()
    // Front-end only: show a toast or update local state. Integrate API call if desired.
    alert('Settings saved (front-end demo)')
  }

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'workspace', label: 'Workspace', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { id: 'notifications', label: 'Notifications', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Settings</h1>
        <p className="text-sm text-muted mt-1">Manage your account and workspace preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="card p-2 space-y-0.5 lg:sticky lg:top-24">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-muted hover:text-ink hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="card p-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-ink">Profile Settings</h2>
                <p className="text-sm text-muted mt-0.5">Update your personal information</p>
              </div>

              {/* Avatar area */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-line">
                <div className="relative group">
                  <div className="avatar w-16 h-16 text-xl">
                    {name ? name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Profile Photo</p>
                  <p className="text-xs text-muted">Click on the avatar to upload</p>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Full name</label>
                    <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
                    <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="btn text-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary text-sm">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* Workspace Section */}
          {activeSection === 'workspace' && (
            <div className="card p-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-ink">Workspace Settings</h2>
                <p className="text-sm text-muted mt-0.5">Configure workspace-specific options</p>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Workspace name</label>
                  <input className="input" value={workspaceName} onChange={e=>setWorkspaceName(e.target.value)} placeholder="Acme Team" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-line">
                  <div>
                    <label className="text-sm font-medium text-ink">Public workspace</label>
                    <p className="text-xs text-muted mt-0.5">Allow public access to workspace board</p>
                  </div>
                  <Toggle id="publicWorkspace" checked={publicWorkspace} onChange={e=>setPublicWorkspace(e.target.checked)} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" className="btn text-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary text-sm">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="card p-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-ink">Notification Preferences</h2>
                <p className="text-sm text-muted mt-0.5">Choose how you want to be notified</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-line">
                  <div>
                    <label className="text-sm font-medium text-ink">Email notifications</label>
                    <p className="text-xs text-muted mt-0.5">Receive email for important updates</p>
                  </div>
                  <Toggle id="notifications" checked={notifications} onChange={e=>setNotifications(e.target.checked)} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-line">
                  <div>
                    <label className="text-sm font-medium text-ink">Task assignments</label>
                    <p className="text-xs text-muted mt-0.5">Get notified when assigned to a task</p>
                  </div>
                  <Toggle id="taskAssign" checked={true} onChange={() => {}} />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-line">
                  <div>
                    <label className="text-sm font-medium text-ink">Invoice updates</label>
                    <p className="text-xs text-muted mt-0.5">Receive notifications for invoice status changes</p>
                  </div>
                  <Toggle id="invoiceUpdates" checked={true} onChange={() => {}} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" className="btn text-sm">Cancel</button>
                <button type="button" className="btn btn-primary text-sm" onClick={handleSave}>Save Changes</button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="card p-6 border-red-200">
            <h3 className="text-base font-semibold text-red-600 mb-1">Danger Zone</h3>
            <p className="text-sm text-muted mb-4">Irreversible and destructive actions</p>
            <button className="btn btn-danger text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
