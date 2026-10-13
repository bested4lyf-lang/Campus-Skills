import { useEffect, useState } from 'react'
import type { ServiceListing } from './types'

// Mock services adhering to the project specification
const INITIAL_SERVICES: ServiceListing[] = [
  {
    id: 1,
    title: 'Professional Flyer & Poster Design',
    description: 'High-quality event flyers, church posters, and social media banners delivered in 24 hours.',
    price: 5000,
    category: 'Graphic Design',
    skill: 'Graphic Design',
    provider: { id: 1, username: 'David' },
    created_at: '2026-10-13T10:00:00Z',
  },
  {
    id: 2,
    title: 'Custom Website & Portfolio Development',
    description: 'Responsive, fast portfolio and landing page development with React and Django.',
    price: 50000,
    category: 'Web Development',
    skill: 'Programming',
    provider: { id: 2, username: 'Sarah' },
    created_at: '2026-10-13T11:30:00Z',
  },
  {
    id: 3,
    title: 'Campus Photography & Portrait Session',
    description: 'Professional outdoor portraits, graduation photos, and headshots around campus.',
    price: 15000,
    category: 'Photography',
    skill: 'Photography',
    provider: { id: 3, username: 'Michael' },
    created_at: '2026-10-13T12:15:00Z',
  },
]

export default function App() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking')
  const [backendInfo, setBackendInfo] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [services] = useState<ServiceListing[]>(INITIAL_SERVICES)

  // Ping Django backend
  useEffect(() => {
    fetch('/api/health/')
      .then(res => {
        if (res.ok) return res.json()
        throw new Error('Non-200 response')
      })
      .then(data => {
        setBackendStatus('connected')
        setBackendInfo(`${data.project} v${data.version}`)
      })
      .catch(() => {
        setBackendStatus('disconnected')
      })
  }, [])

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            padding: '0.5rem 0.85rem',
            borderRadius: '0.75rem',
          }}>
            CS
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
              CampusSkill
            </h1>
            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Student Skills & Service Marketplace</p>
          </div>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 600,
          background: backendStatus === 'connected' ? '#ecfdf5' : backendStatus === 'checking' ? '#fef9c3' : '#fef2f2',
          color: backendStatus === 'connected' ? '#047857' : backendStatus === 'checking' ? '#a16207' : '#b91c1c',
          border: `1px solid ${backendStatus === 'connected' ? '#a7f3d0' : backendStatus === 'checking' ? '#fde047' : '#fecaca'}`,
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: backendStatus === 'connected' ? '#10b981' : backendStatus === 'checking' ? '#eab308' : '#ef4444',
          }} />
          {backendStatus === 'connected' && `Backend API Online (${backendInfo})`}
          {backendStatus === 'checking' && 'Pinging Django API...'}
          {backendStatus === 'disconnected' && 'Django Backend Offline (Run: python manage.py runserver)'}
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)',
        padding: '3rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{
            background: '#e0e7ff',
            color: '#4338ca',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
          }}>
            Sprint 1 Scaffold Ready
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', color: '#0f172a' }}>
            Empowering Campus Freelancers
          </h2>
          <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Every user is a <strong>Student</strong> who can both offer skills as a <strong>Service Provider</strong> and request services as a <strong>Customer</strong>.
          </p>

          {/* Search Box */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', maxWidth: '500px', marginInline: 'auto' }}>
            <input
              type="text"
              placeholder="Search services (e.g. Graphic Design, Tutoring, Web)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid #cbd5e1',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1, width: '100%' }}>
        {/* Marketplace Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Available Campus Services</h3>
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Showing {filteredServices.length} student offerings</p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredServices.map(service => (
              <div
                key={service.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#4f46e5',
                      background: '#eef2ff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.375rem',
                    }}>
                      {service.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      By <strong>{service.provider.username}</strong>
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {service.title}
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {service.description}
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '1rem',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Price</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      ₦{service.price.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => alert(`Requesting service: "${service.title}" from ${service.provider.username}`)}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  >
                    Request Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Collaboration Box */}
        <section style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '1rem',
          padding: '2rem',
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>
            🚀 Team Sprint 1 Overview
          </h3>
          <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            This repository is structured for your 4-person team. Both teams can work simultaneously without conflicts:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#4f46e5', marginBottom: '0.25rem' }}>🎨 Team Lead (You)</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Figma wireframes, UI/UX consistency, API contract alignment, reviewing Pull Requests.
              </div>
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#06b6d4', marginBottom: '0.25rem' }}>💻 Frontend (2 Devs)</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                React + TypeScript in <code>/frontend</code>. Building Auth modals, Request workflow UI, and Profile views.
              </div>
            </div>
            <div style={{ background: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '0.25rem' }}>⚙️ Backend (2 Devs)</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Django + DRF in <code>/backend</code>. Creating models, serializers, migration files, and REST endpoints.
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        color: '#94a3b8',
        fontSize: '0.85rem',
        borderTop: '1px solid #e2e8f0',
        background: '#ffffff'
      }}>
        CampusSkill Project • Dual-Role Student Marketplace • Django 6 + React TypeScript
      </footer>
    </div>
  )
}
