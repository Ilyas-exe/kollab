import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: 'Project Management',
      copy: 'Plan work in Kanban boards, assign owners, and track progress through clear stages.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      color: 'blue',
    },
    {
      title: 'Real-Time Chat',
      copy: 'Keep decisions in context with project-based conversations and instant messaging.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'purple',
    },
    {
      title: 'Invoice Control',
      copy: 'Create professional invoices, track status, and manage your entire billing lifecycle.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'orange',
    },
    {
      title: 'Secure Payments',
      copy: 'Collect payments safely with Stripe-backed processing. Fast, reliable, and secure.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'green',
    },
    {
      title: 'Team Collaboration',
      copy: 'Invite collaborators, manage roles, and keep permissions clear across all workspaces.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'red',
    },
    {
      title: 'Smart Notifications',
      copy: 'Stay aligned with contextual updates for tasks, invoices, messages, and deadlines.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      color: 'blue',
    },
  ];

  const iconColorMap = {
    blue: 'kpi-icon-blue',
    purple: 'kpi-icon-purple',
    orange: 'kpi-icon-orange',
    green: 'kpi-icon-green',
    red: 'kpi-icon-red',
  };

  const steps = [
    { step: '01', title: 'Create Your Workspace', desc: 'Set up your workspace in seconds and invite your team to collaborate.' },
    { step: '02', title: 'Manage Projects', desc: 'Organize tasks in Kanban boards, track progress, and keep everyone aligned.' },
    { step: '03', title: 'Get Paid Faster', desc: 'Send invoices, collect payments through Stripe, and manage your revenue.' },
  ];

  const testimonials = [
    { name: 'Sarah Chen', role: 'Product Designer', company: 'Pixel Studio', quote: 'Kollab has transformed how we manage client work. The workspace concept keeps everything organized and our clients love the transparency.' },
    { name: 'Marcus Reid', role: 'Freelance Developer', company: 'Independent', quote: "Finally, a tool that doesn't overcomplicate things. I can see my tasks, send invoices, and chat with clients — all in one place." },
    { name: 'Amira Patel', role: 'Agency Owner', company: 'Bright Labs', quote: 'We switched from three different tools to Kollab. Our team is more productive and invoicing is no longer a headache.' },
  ];

  const stats = [
    { value: '10k+', label: 'Teams' },
    { value: '50k+', label: 'Projects' },
    { value: '99.9%', label: 'Uptime' },
    { value: '$2M+', label: 'Invoiced' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Sticky Navigation ─── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md border-b border-line shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)' }}>
                K
              </div>
              <span className="text-lg font-bold tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif', color: scrolled ? '#0b1726' : '#0b1726' }}>
                Kollab
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted hover:text-ink transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-muted hover:text-ink transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm font-medium text-muted hover:text-ink transition-colors">Testimonials</a>
            </nav>

            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="text-sm font-medium text-muted hover:text-ink transition-colors px-3 py-2">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn-primary text-sm px-5 py-2.5 rounded-lg">
                Start Free →
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{ background: 'radial-gradient(circle, #4f6ef7, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/15">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-soft" />
                <span className="text-xs font-semibold text-accent">Now with Stripe payments</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                Manage projects.{' '}
                <span className="gradient-text">Send invoices.</span>{' '}
                Get paid.
              </h1>

              <p className="text-lg text-muted leading-relaxed max-w-lg">
                The all-in-one workspace for freelancers and agencies. Consolidate projects, tasks, chat, and billing in one beautiful interface.
              </p>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => navigate('/register')} className="btn-primary text-base px-7 py-3.5 rounded-xl">
                  <span className="flex items-center gap-2">
                    Get Started Free
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </button>
                <button onClick={() => navigate('/login')} className="btn text-base px-7 py-3.5 rounded-xl">
                  Sign In
                </button>
              </div>

              {/* Social proof mini */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {['#4f6ef7', '#34d399', '#fb923c', '#ec4899'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                      {['S', 'M', 'A', 'J'][i]}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted">
                  <span className="font-semibold text-ink">2,500+</span> teams already using Kollab
                </div>
              </div>
            </div>

            {/* Right: Dashboard Preview Card */}
            <div className="relative animate-fade-in-up">
              <div className="bg-white rounded-2xl border border-line shadow-elevated p-6 space-y-5">
                {/* Mini header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted font-medium">Active Workspace</p>
                    <p className="text-lg font-bold text-ink">Website Redesign</p>
                  </div>
                  <span className="badge-info text-xs">Q2 Delivery</span>
                </div>

                {/* KPI mini row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-pastel-blue rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-ink">12</p>
                    <p className="text-xs text-muted">Tasks</p>
                  </div>
                  <div className="bg-pastel-green rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-ink">8</p>
                    <p className="text-xs text-muted">Done</p>
                  </div>
                  <div className="bg-pastel-orange rounded-xl p-3 text-center">
                    <p className="text-xl font-bold text-ink">$4.2k</p>
                    <p className="text-xs text-muted">Invoiced</p>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-ink">Progress</span>
                    <span className="text-sm font-bold text-accent">72%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: '72%', background: 'linear-gradient(90deg, #4f6ef7, #7c3aed)' }} />
                  </div>
                </div>

                {/* Mini task list */}
                <div className="space-y-2.5">
                  {[
                    { name: 'Homepage wireframes', status: 'Done', statusCls: 'badge-success' },
                    { name: 'Design system tokens', status: 'In Progress', statusCls: 'badge-info' },
                    { name: 'API integration', status: 'To Do', statusCls: 'badge-neutral' },
                  ].map((task) => (
                    <div key={task.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50/70">
                      <span className="text-sm font-medium text-ink">{task.name}</span>
                      <span className={`${task.statusCls} text-[10px] px-2 py-0.5`}>{task.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating decorations */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-elevated p-3 border border-line animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pastel-green flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">Invoice Paid</p>
                    <p className="text-[10px] text-muted">$2,400.00</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 -left-3 bg-white rounded-xl shadow-elevated p-3 border border-line animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-pastel-blue flex items-center justify-center">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink">New Message</p>
                    <p className="text-[10px] text-muted">Sarah: "Looks great!"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-line bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>{stat.value}</p>
                <p className="text-sm text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/5 border border-accent/15 mb-6">
              <span className="text-xs font-semibold text-accent">Everything you need</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Built for how you actually work
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Structured tools that keep work visible for both sides. No complexity, just clarity.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card-interactive p-6 group"
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <div className={`kpi-icon ${iconColorMap[feature.color]} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feature.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Get started in minutes
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Three simple steps to transform your client workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-accent/30 via-accent/60 to-accent/30" />

            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white text-xl font-bold mb-6 relative z-10" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)', boxShadow: '0 4px 20px rgba(79, 110, 247, 0.3)' }}>
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-ink mb-4" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
              Loved by teams everywhere
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              Hear from the people who use Kollab every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 space-y-4">
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="avatar avatar-sm" style={{ background: ['#4f6ef7', '#34d399', '#fb923c'][i] }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{t.name}</p>
                    <p className="text-xs text-muted">{t.role} · {t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden p-12 lg:p-16 text-center" style={{ background: 'linear-gradient(135deg, #0f1724 0%, #1a2744 100%)' }}>
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, #4f6ef7, transparent 70%)' }} />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
            </div>

            <div className="relative space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
                Ready to move faster?
              </h2>
              <p className="text-gray-400 text-lg">
                Create a workspace and invite your first collaborators. Free to get started.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={() => navigate('/register')} className="bg-white text-ink font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg text-sm">
                  Start Free Today
                </button>
                <button onClick={() => navigate('/login')} className="border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all text-sm">
                  View Existing Workspace
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-line bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid gap-8 md:grid-cols-5">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #4f6ef7 0%, #3451db 100%)' }}>
                  K
                </div>
                <span className="text-base font-bold text-ink" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Kollab</span>
              </div>
              <p className="text-sm text-muted leading-relaxed max-w-xs">
                The all-in-one workspace for freelancers and agencies. Collaborate cleanly and get paid on time.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Product</h4>
              <ul className="space-y-2.5">
                <li><a href="#features" className="text-sm text-muted hover:text-ink transition-colors">Features</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Pricing</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Company</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">About</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Blog</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Support</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Help Center</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Contact</a></li>
                <li><a href="#" className="text-sm text-muted hover:text-ink transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-line">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-xs text-muted">© 2025 Kollab. All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="text-muted hover:text-ink transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
