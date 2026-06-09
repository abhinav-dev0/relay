import Login from '../components/Login'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router'
import { LayoutDashboard, Users, Flag, Zap, ShieldCheck, Puzzle } from 'lucide-react'

const Home = () => {
    const { token } = useAuthStore()
    const navigate = useNavigate()

    return (
        <div className="landing">
            {/* ── Nav ── */}
            <nav className="landing-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div className="navbar-brand">
                        <img src="/relay-logo.png" alt="Relay Logo" style={{ width: '28px', height: '28px' }} />
                        <span>Relay</span>
                    </div>
                    <div className="navbar-links" style={{ display: 'flex', gap: '24px' }}>
                        <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>Features</a>
                        <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>How it Works</a>
                    </div>
                </div>

                {token ? (
                    <button className="btn btn-primary btn-sm" onClick={() => navigate('/tenant')}>
                        Go to App →
                    </button>
                ) : (
                    <a href="#auth" className="btn btn-ghost btn-sm">Sign in →</a>
                )}
            </nav>

            {/* ── Hero ── */}
            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-hero-content">
                        <span className="landing-eyebrow">Project Management</span>
                        <h1 className="landing-heading">
                            Work together.<br />
                            Achieve <em>more.</em>
                        </h1>
                        <p className="landing-subtitle">
                            Relay keeps your team aligned with kanban boards,
                            real-time issue tracking, and drag-and-drop workflows.
                            No clutter. No learning curve. Just collaboration.
                        </p>
                        <div className="landing-cta-group">
                            {token ? (
                                <button className="btn btn-primary btn-lg" onClick={() => navigate('/tenant')}>
                                    Open your Workspace
                                </button>
                            ) : (
                                <a href="#auth" className="btn btn-primary btn-lg">
                                    Get started free
                                </a>
                            )}
                            <a href="#features" className="btn btn-secondary btn-lg">
                                See features
                            </a>
                        </div>
                    </div>
                    
                    {!token ? (
                        <div className="landing-auth-section" id="auth">
                            <Login />
                        </div>
                    ) : (
                        <div className="landing-hero-art" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img 
                                src="/hero-art.png" 
                                alt="Abstract Workflow Illustration" 
                                style={{ width: '100%', maxWidth: '450px', objectFit: 'contain', borderRadius: '16px', boxShadow: '0 20px 40px rgba(51, 61, 121, 0.15)' }} 
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* ── Trust Strip ── */}
            <div className="landing-trust">
                <div className="landing-trust-label">
                    Trusted by teams worldwide
                </div>
                <div className="landing-trust-logos">
                    <span className="landing-trust-logo">Acme Corp</span>
                    <span className="landing-trust-logo">NovaTech</span>
                    <span className="landing-trust-logo">Hyperion</span>
                    <span className="landing-trust-logo">Axiom</span>
                    <span className="landing-trust-logo">Meridian</span>
                </div>
            </div>

            <hr className="landing-divider" />

            {/* ── Features ── */}
            <section className="landing-features-section" id="features">
                <div className="landing-section-header">
                    <div className="landing-section-eyebrow">Features</div>
                    <h2 className="landing-section-title">Everything you need, nothing you don't</h2>
                    <p className="landing-section-desc">
                        A focused set of tools designed for teams that prefer
                        doing the work over configuring project management software.
                    </p>
                </div>
                <div className="landing-features-grid">
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <LayoutDashboard size={24} />
                        </div>
                        <div className="landing-feature-title">Kanban Boards</div>
                        <div className="landing-feature-desc">
                            Drag-and-drop cards between columns. Status updates
                            persist instantly. See your entire pipeline at a glance.
                        </div>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <Users size={24} />
                        </div>
                        <div className="landing-feature-title">Multi-Tenant Orgs</div>
                        <div className="landing-feature-desc">
                            Create organisations, invite teammates with a code,
                            and manage multiple projects under one roof.
                        </div>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <Flag size={24} />
                        </div>
                        <div className="landing-feature-title">Priority Tracking</div>
                        <div className="landing-feature-desc">
                            Tag tasks as Urgent, High, Medium, or Low.
                            Color-coded badges make priorities impossible to miss.
                        </div>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <Zap size={24} />
                        </div>
                        <div className="landing-feature-title">Instant Updates</div>
                        <div className="landing-feature-desc">
                            Click any card to view details, edit inline,
                            and save — no page reloads, no waiting.
                        </div>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="landing-feature-title">Secure by Default</div>
                        <div className="landing-feature-desc">
                            JWT authentication, tenant isolation, and encrypted
                            passwords. Your data stays yours.
                        </div>
                    </div>
                    <div className="landing-feature-card">
                        <div className="landing-feature-icon">
                            <Puzzle size={24} />
                        </div>
                        <div className="landing-feature-title">Simple & Focused</div>
                        <div className="landing-feature-desc">
                            No complex charts, no timesheets, no 47-tab settings page.
                            Just the tools you actually use, every day.
                        </div>
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* ── How It Works ── */}
            <section className="landing-steps" id="how-it-works">
                <div className="landing-section-header">
                    <div className="landing-section-eyebrow">How it works</div>
                    <h2 className="landing-section-title">Up and running in four steps</h2>
                    <p className="landing-section-desc">
                        No onboarding calls. No enterprise sales pitch. Just sign up and go.
                    </p>
                </div>
                <div className="landing-steps-grid">
                    <div className="landing-step">
                        <div className="landing-step-number">01</div>
                        <div className="landing-step-title">Create Account</div>
                        <div className="landing-step-desc">
                            Sign up with your email. Takes about 10 seconds.
                        </div>
                    </div>
                    <div className="landing-step">
                        <div className="landing-step-number">02</div>
                        <div className="landing-step-title">Set Up Org</div>
                        <div className="landing-step-desc">
                            Create your organisation and invite your team with a join code.
                        </div>
                    </div>
                    <div className="landing-step">
                        <div className="landing-step-number">03</div>
                        <div className="landing-step-title">Create Projects</div>
                        <div className="landing-step-desc">
                            Spin up projects in one click. Each gets its own board.
                        </div>
                    </div>
                    <div className="landing-step">
                        <div className="landing-step-number">04</div>
                        <div className="landing-step-title">Start Collaborating</div>
                        <div className="landing-step-desc">
                            Add tasks, drag between columns, track everything visually.
                        </div>
                    </div>
                </div>
            </section>

            <hr className="landing-divider" />

            {/* ── Bottom CTA ── */}
            <section className="landing-bottom-cta">
                <h2 className="landing-bottom-cta-title">
                    Ready to stop managing and start collaborating?
                </h2>
                <p className="landing-bottom-cta-desc">
                    Join teams who swapped their bloated PM tools for something that actually works.
                </p>
                {token ? (
                    <button className="btn btn-primary btn-lg" onClick={() => navigate('/tenant')}>
                        Open your Workspace
                    </button>
                ) : (
                    <a href="#auth" className="btn btn-primary btn-lg" style={{ position: 'relative', zIndex: 1 }}>
                        Get started — it's free
                    </a>
                )}
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <span>© {new Date().getFullYear()} Relay</span>
                <span className="landing-footer-tagline">Work passing smoothly between people.</span>
            </footer>
        </div>
    )
}

export default Home