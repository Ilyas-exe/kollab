import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      {/* Header/Navbar */}
      <header className="bg-transparent sticky top-0 z-50">
        <div className="page-wrap py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-accent text-white border border-transparent flex items-center justify-center text-sm font-semibold rounded-md">
              K
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">Kollab</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="btn btn-ghost">
              Login
            </button>
            <button onClick={() => navigate('/register')} className="btn btn-primary">
              Start Free
            </button>
          </div>
        </div>
      </header>

      <main className="page-wrap py-16 space-y-20">
        {/* Hero - vibrant, elegant */}
        <section className="relative overflow-hidden">
          <div className="rounded-xl bg-gradient-to-br from-accent/95 via-accent-2/85 to-accent-3/70 py-20 px-6">
            <div className="mx-auto w-full max-w-6xl grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6 text-white">
                <p className="label text-white/90">Client and Freelancer Workspace</p>
                <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                  Beautifully simple collaboration for client work.
                </h1>
                <p className="text-base text-white/85 max-w-xl leading-relaxed">
                  Consolidate projects, messages, invoices and payments in one elegant workspace. Less noise, more momentum — built for modern teams.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => navigate('/register')} className="btn btn-primary">
                    Create workspace
                  </button>
                  <button onClick={() => navigate('/login')} className="btn btn-ghost text-white/95">
                    Sign in
                  </button>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="badge bg-white/10 border-white/10 text-white">Projects</span>
                  <span className="badge bg-white/10 border-white/10 text-white">Tasks</span>
                  <span className="badge bg-white/10 border-white/10 text-white">Invoices</span>
                  <span className="badge bg-white/10 border-white/10 text-white">Chat</span>
                </div>
              </div>
              <div className="p-6">
                <div className="rounded-xl p-6 bg-white/60 backdrop-blur-sm border border-white/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-muted">Active Workspace</p>
                      <p className="text-lg font-semibold text-ink">Website Redesign</p>
                    </div>
                    <div className="text-sm text-muted">Q2 Delivery</div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted">Status</p>
                        <p className="text-sm font-semibold text-ink">In Progress</p>
                      </div>
                      <div className="text-sm text-accent font-semibold">72% done</div>
                    </div>
                    <div className="h-2 bg-line rounded-full overflow-hidden">
                      <div className="h-full bg-accent-2" style={{ width: '72%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="section-title">Everything you need to deliver</h2>
            <p className="section-subtitle">Structured tools that keep work visible for both sides.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Project Management',
                copy: 'Plan work in boards, assign owners, and move tasks with clear stages.',
              },
              {
                title: 'Real-Time Chat',
                copy: 'Keep decisions in context with project-based conversations.',
              },
              {
                title: 'Invoice Control',
                copy: 'Create professional invoices and track status in one place.',
              },
              {
                title: 'Secure Payments',
                copy: 'Collect payments safely with Stripe-backed processing.',
              },
              {
                title: 'Team Access',
                copy: 'Invite collaborators and keep permissions clear.',
              },
              {
                title: 'Notifications',
                copy: 'Stay aligned with updates for tasks, invoices, and messages.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6">
                <h3 className="text-base font-semibold text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="section-title">Why teams choose Kollab</h2>
            <p className="section-subtitle">
              A focused workflow for client delivery, built to reduce noise and keep accountability clear.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              'One workspace for client delivery',
              'Clear ownership on every task',
              'Structured invoice lifecycle',
              'Reliable notifications with context',
            ].map((item) => (
              <div key={item} className="card p-4">
                <p className="text-sm font-medium text-ink">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="card-strong p-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-ink">Ready to move faster?</h2>
            <p className="text-sm text-muted">Create a workspace and invite your first collaborators.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/register')} className="btn btn-primary">
              Start now
            </button>
            <button onClick={() => navigate('/login')} className="btn">
              View existing workspace
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-line bg-surface">
        <div className="page-wrap py-10 grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-accent text-white border border-accent flex items-center justify-center text-xs font-semibold">
                K
              </div>
              <span className="text-sm font-semibold text-ink">Kollab</span>
            </div>
            <p className="text-sm text-muted">Collaborate cleanly and get paid on time.</p>
          </div>
          <div>
            <h4 className="label mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-ink">Features</a></li>
              <li><a href="#" className="hover:text-ink">Pricing</a></li>
              <li><a href="#" className="hover:text-ink">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="label mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-ink">About</a></li>
              <li><a href="#" className="hover:text-ink">Blog</a></li>
              <li><a href="#" className="hover:text-ink">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="label mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-ink">Help Center</a></li>
              <li><a href="#" className="hover:text-ink">Contact</a></li>
              <li><a href="#" className="hover:text-ink">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="page-wrap py-6 text-xs text-muted">&copy; 2025 Kollab. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
