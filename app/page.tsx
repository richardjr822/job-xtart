'use client';

import Link from 'next/link';
import styles from './page.module.css';
import Header from '../components/3-organisms/Header';

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const JobIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

const NotifyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function LandingPage() {
  return (
    <>
      <Header />
      <main className={styles.pageContainer}>
        {/* Hero Section */}
        <section className={styles.mainContent}>
          <h1>Welcome to Job Start</h1>
          <p className={styles.subheadline}>
            Job Start connects you with quick, short-term jobs in your neighborhood.
            No resumes, no long applications. Just real work, right now. <br />
            <strong>Find Flexible Work in Your Community. Today.</strong>
          </p>
          <Link href="/auth/signup" className={styles.ctaButton}>Get Started</Link>
        </section>

        {/* About Section */}
        <section id="about-section" style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '2rem',
              color: 'var(--text-color)'
            }}>
              About Job Start
            </h2>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: 'var(--text-color)',
              opacity: 0.8,
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              Job Start is a revolutionary platform designed to bridge the gap between job seekers and employers in your local community. 
              We believe work should be flexible, accessible, and rewarding for everyone.
            </p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '2rem'
            }}>
              {/* Benefit 1 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    color: '#0749AA',
                    flexShrink: 0
                  }}>
                    <CheckIcon />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-color)',
                    margin: 0
                  }}>
                    No Barriers
                  </h3>
                </div>
                <p style={{
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Start earning immediately without lengthy qualification processes.
                </p>
              </div>

              {/* Benefit 2 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    color: '#0749AA',
                    flexShrink: 0
                  }}>
                    <CheckIcon />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-color)',
                    margin: 0
                  }}>
                    Fair Rates
                  </h3>
                </div>
                <p style={{
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  Competitive pay rates set by employers in your community.
                </p>
              </div>

              {/* Benefit 3 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--nav-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    color: '#0749AA',
                    flexShrink: 0
                  }}>
                    <CheckIcon />
                  </div>
                  <h3 style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-color)',
                    margin: 0
                  }}>
                    Support
                  </h3>
                </div>
                <p style={{
                  color: 'var(--text-color)',
                  opacity: 0.7,
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  24/7 support to help you succeed on the platform.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features-section" style={{
          padding: '4rem 2rem',
          backgroundColor: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2.5rem',
              textAlign: 'center',
              marginBottom: '3rem',
              color: 'var(--text-color)'
            }}>
              Why Choose Job Start?
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* Feature 1 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--page-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0749AA'
                  }}>
                    <JobIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>
                    Quick & Easy
                  </h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Find and apply for jobs in minutes. No lengthy application process, just connect with opportunities nearby.
                </p>
              </div>

              {/* Feature 2 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--page-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0749AA'
                  }}>
                    <ProfileIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>
                    Flexible Work
                  </h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Work on your schedule. Choose jobs that fit your lifestyle and earn extra income on your terms.
                </p>
              </div>

              {/* Feature 3 */}
              <div style={{
                padding: '2rem',
                backgroundColor: 'var(--page-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0749AA'
                  }}>
                    <NotifyIcon />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-color)', margin: 0 }}>
                    Local Community
                  </h3>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7, lineHeight: '1.6' }}>
                  Connect with employers and workers in your neighborhood. Build your local network while earning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          width: '100%',
          padding: '2rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--nav-bg)',
          color: 'var(--text-color)'
        }}>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
            © {new Date().getFullYear()} Job Start. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <Link href="/privacy" style={{
              color: '#0749AA',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              cursor: 'pointer'
            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Privacy Policy
            </Link>
            <Link href="/terms" style={{
              color: '#0749AA',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              cursor: 'pointer'
            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Terms of Service
            </Link>
            <Link href="/contact" style={{
              color: '#0749AA',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
              cursor: 'pointer'
            }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
              Contact Us
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}