import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroIsometric from '../../assets/hero-isometric.png';
import { useToast } from '../../components/Toast/Toast.jsx';
import AccountMenu from '../../components/AccountMenu/AccountMenu.jsx';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [searchDone, setSearchDone] = useState(false);
  const [acceptedCards, setAcceptedCards] = useState({});

  function handleSearch(e) {
    e.preventDefault();
    setSearchDone(true);
  }

  function acceptCard(key, label) {
    setAcceptedCards((prev) => ({ ...prev, [key]: true }));
    showToast(label);
  }

  return (
    <div className="land">
      <header className="land-header">
        <div className="land-header__inner">
          <div className="land-brand" onClick={() => navigate('/')}>
            <div className="land-brand__mark">
              <span className="material-symbols-outlined" style={{ color: 'var(--land-secondary)', fontSize: 22 }}>
                water_drop
              </span>
            </div>
            <div className="land-brand__text">
              <span className="land-brand__name">BloodLink</span>
              <span className="land-brand__sub">India Grid</span>
            </div>
          </div>

          <nav className="land-nav">
            <a className="land-nav__link" onClick={() => navigate('/dashboard')}>
              Dashboard
            </a>
            <a className="land-nav__link" onClick={() => navigate('/alerts/req-1')}>
              Alerts
            </a>
            <a className="land-nav__link" onClick={() => navigate('/donors/req-1')}>
              Donors
            </a>
            <a className="land-nav__link" onClick={() => navigate('/transparency')}>
              Transparency
            </a>
          </nav>

          <div className="land-header__right">
            <a className="land-cta-pill" onClick={() => navigate('/dashboard')}>
              <span className="land-cta-pill__dot" />
              <span>Enter Live Dashboard</span>
            </a>
            <AccountMenu
              name="Dr. S. Kulkarni"
              role="Duty Dispatcher · Andheri West"
              trigger={
                <div className="land-avatar">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    person
                  </span>
                </div>
              }
            />
          </div>
        </div>
      </header>

      <main className="land-main">
        <aside className="land-ticker">
          <div className="land-ticker__inner">
            <div className="land-ticker__left">
              <span className="land-ticker__dot">
                <span className="land-ticker__dot-ping" />
                <span className="land-ticker__dot-core" />
              </span>
              <span className="land-ticker__label">Live Network</span>
              <span className="land-ticker__text">
                42 Critical SOS Alerts Active across Delhi NCR, Mumbai, Bengaluru &amp; Hyderabad
              </span>
            </div>
            <div className="land-ticker__right">
              <span className="land-ticker__stat land-ticker__stat--tertiary">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  timer
                </span>
                Avg Dispatch: <strong>4.8 min</strong>
              </span>
              <span className="land-ticker__stat land-ticker__stat--primary">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  hub
                </span>
                Realtime Mesh: <strong>736 Districts</strong>
              </span>
              <span className="land-ticker__stat">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  lock
                </span>
                100% Voluntary &amp; Non-commercial
              </span>
            </div>
          </div>
        </aside>

        <section className="land-hero">
          <div className="land-hero__bg">
            <img className="land-hero__bg-img" src={heroIsometric} alt="" aria-hidden="true" />
            <div className="land-hero__bg-vignette" />
            <div className="land-hero__bg-dots" />
          </div>
          <div className="land-hero__content">
            <h1 className="land-hero__title">
              Find the right donor <span className="land-hero__title-accent">before time runs out</span>
            </h1>
            <p className="land-hero__subtitle">
              India's real-time algorithmic network connecting ICUs, verified antigen-matched donors, and
              high-priority transit within minutes.
            </p>
            <div className="land-hero__actions">
              <a className="land-hero__btn-primary" href="#emergency-search">
                <span className="land-hero__btn-primary-dot" />
                <span>Request Blood or Register</span>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  arrow_forward
                </span>
              </a>
              <a className="land-hero__btn-ghost" href="#algorithmic-journey">
                <span className="material-symbols-outlined" style={{ color: 'var(--land-primary)', fontSize: 20 }}>
                  play_circle
                </span>
                <span>Watch 4-Minute Dispatch Cycle</span>
              </a>
            </div>

            <div className="land-hero__stats">
              <div className="land-hero__stat">
                <div className="land-hero__stat-label">Engine Latency</div>
                <div className="land-hero__stat-value land-hero__stat-value--tertiary">140ms</div>
                <div className="land-hero__stat-sub">Antigen compatibility scan</div>
              </div>
              <div className="land-hero__stat">
                <div className="land-hero__stat-label">Realtime Active Corridor</div>
                <div className="land-hero__stat-value land-hero__stat-value--primary">18,420</div>
                <div className="land-hero__stat-sub">Donors logged on grid</div>
              </div>
              <div className="land-hero__stat">
                <div className="land-hero__stat-label">Critical Response Window</div>
                <div className="land-hero__stat-value land-hero__stat-value--secondary">&lt; 4.8 min</div>
                <div className="land-hero__stat-sub">From SOS to verified match</div>
              </div>
              <div className="land-hero__stat">
                <div className="land-hero__stat-label">Verified Blood Banks</div>
                <div className="land-hero__stat-value">4,820 Hubs</div>
                <div className="land-hero__stat-sub">Direct e-RaktKosh integration</div>
              </div>
            </div>
          </div>
        </section>

        <section className="land-search" id="emergency-search">
          <div className="land-search__card">
            <div className="land-search__header">
              <div className="land-search__header-left">
                <span className="land-search__pulse" />
                <span className="land-search__title">Emergency Antigen Donor Search</span>
              </div>
              <div className="land-search__online">
                <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)', fontSize: 18 }}>
                  radio_button_checked
                </span>
                <span>18,420 Active Donors Online</span>
              </div>
            </div>

            <form className="land-search__form" onSubmit={handleSearch}>
              <div className="land-field">
                <label htmlFor="blood-group">Blood Antigen Type</label>
                <div className="land-field__control">
                  <select id="blood-group" defaultValue="O_NEG">
                    <option value="O_NEG">O Negative (Universal - Urgent)</option>
                    <option value="O_POS">O Positive (High Demand)</option>
                    <option value="A_POS">A Positive</option>
                    <option value="A_NEG">A Negative</option>
                    <option value="B_POS">B Positive</option>
                    <option value="B_NEG">B Negative</option>
                    <option value="AB_POS">AB Positive</option>
                    <option value="AB_NEG">AB Negative</option>
                    <option value="BOMBAY">Bombay Blood Group (Rare hh)</option>
                  </select>
                  <span className="material-symbols-outlined land-field__icon">expand_more</span>
                </div>
              </div>

              <div className="land-field">
                <label htmlFor="location-hub">Hospital / District Pin</label>
                <div className="land-field__control">
                  <input
                    id="location-hub"
                    type="text"
                    placeholder="e.g. AIIMS Delhi / 110029"
                    defaultValue="City Hospital, Andheri"
                  />
                  <span className="material-symbols-outlined land-field__icon">location_on</span>
                </div>
              </div>

              <div className="land-field">
                <label htmlFor="urgency-tier">Clinical Priority Level</label>
                <div className="land-field__control">
                  <select id="urgency-tier" defaultValue="CRITICAL">
                    <option value="CRITICAL">Immediate Critical (Transit &lt; 60m)</option>
                    <option value="HIGH">High Priority (&lt; 4 Hours)</option>
                    <option value="SCHEDULED">Scheduled Surgery (Next 24 Hours)</option>
                    <option value="THALASSEMIA">Thalassemia Recurring Need</option>
                  </select>
                  <span className="material-symbols-outlined land-field__icon">expand_more</span>
                </div>
              </div>

              <div className="land-field land-field--submit">
                <button className="land-search__submit" type="submit">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    radar
                  </span>
                  <span>Scan 8km Grid</span>
                </button>
              </div>
            </form>

            {searchDone && (
              <div className="land-search__feedback">
                <div className="land-search__feedback-left">
                  <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)' }}>
                    check_circle
                  </span>
                  <span>
                    <strong>7 Eligible O− Donors Located</strong> within 6.4km of City Hospital, Andheri. Dispatched
                    encrypted ping.
                  </span>
                </div>
                <span className="land-search__feedback-eta">ETA: 18 mins</span>
              </div>
            )}
          </div>
        </section>

        <section className="land-journey" id="algorithmic-journey">
          <div className="land-section-inner">
            <div className="land-journey__header">
              <div>
                <span className="land-eyebrow">Closed-Loop Telemetry Protocol</span>
                <h2 className="land-h2">The 4-Minute Algorithmic Match Cycle</h2>
              </div>
              <p className="land-journey__desc">
                How our ISO-certified distributed architecture bridges acute ICU deficits with live donor
                mobilization without manual phone cascades.
              </p>
            </div>

            <div className="land-journey__grid">
              {[
                {
                  n: '01',
                  icon: 'sos',
                  iconBg: 'secondary',
                  title: 'Hospital SOS Trigger',
                  desc: 'ICU medical officer inputs exact red cell, platelet, or whole blood antigens via FHIR API or emergency portal.',
                  foot: 'Latency: 1.2s',
                  footIcon: 'sensors',
                  accent: 'secondary',
                },
                {
                  n: '02',
                  icon: 'all_inclusive',
                  iconBg: 'primary',
                  title: 'Algorithmic Radius Match',
                  desc: 'Central server executes geospatial k-nearest-neighbor search across voluntary donors within a dynamic 8km corridor.',
                  foot: 'Compute: 140ms',
                  footIcon: 'memory',
                  accent: 'primary',
                },
                {
                  n: '03',
                  icon: 'verified',
                  iconBg: 'tertiary',
                  title: 'Bio-Verification Gate',
                  desc: 'Validates 90-day cooldown period, hemoglobin baseline record, weight limits, and verifies identity against digital health ID.',
                  foot: 'NBTC Compliance',
                  footIcon: 'verified_user',
                  accent: 'tertiary',
                },
                {
                  n: '04',
                  icon: 'navigation',
                  iconBg: 'bright',
                  title: 'Green-Corridor Transit',
                  desc: 'Donor arrives at dedicated express donation bank or temperature-controlled drone/courier transit executes delivery.',
                  foot: 'Sub-15m Inbound',
                  footIcon: 'local_shipping',
                  accent: 'onsurface',
                },
              ].map((stage) => (
                <div className="land-stage" key={stage.n}>
                  <div className="land-stage__number">{stage.n}</div>
                  <div>
                    <div className={`land-stage__icon land-stage__icon--${stage.iconBg}`}>
                      <span className="material-symbols-outlined" style={{ fontSize: 26 }}>
                        {stage.icon}
                      </span>
                    </div>
                    <h3 className="land-stage__title">{stage.title}</h3>
                    <p className="land-stage__desc">{stage.desc}</p>
                  </div>
                  <div className={`land-stage__foot land-stage__foot--${stage.accent}`}>
                    <span>{stage.foot}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      {stage.footIcon}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="land-live-queue">
          <div className="land-section-inner">
            <div className="land-live-queue__header">
              <div>
                <div className="land-live-queue__eyebrow-row">
                  <span className="land-live-queue__ping" />
                  <span className="land-eyebrow land-eyebrow--secondary">Urgent Active Demands</span>
                </div>
                <h2 className="land-h2">Live Priority Allocation Queue</h2>
              </div>
              <div className="land-live-queue__refresh">
                <span>Telemetry refreshed every 10s</span>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--land-tertiary)' }}>
                  autorenew
                </span>
              </div>
            </div>

            <div className="land-live-queue__grid">
              <div className="land-queue-card">
                <div className="land-queue-card__stripe land-queue-card__stripe--secondary" />
                <div>
                  <div className="land-queue-card__top">
                    <span className="land-queue-card__group land-queue-card__group--secondary">O- NEGATIVE</span>
                    <span className="land-queue-card__expiry land-queue-card__expiry--error">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        timer
                      </span>
                      EXPIRES 28m
                    </span>
                  </div>
                  <h4 className="land-queue-card__hospital">Safdarjung Emergency Trauma</h4>
                  <p className="land-queue-card__location">Ring Road, New Delhi · Acute Hemorrhage ICU</p>
                  <div className="land-queue-card__rows">
                    <div className="land-queue-card__row">
                      <span>Units Required:</span>
                      <span className="land-queue-card__row-value">4 Units (PRBC)</span>
                    </div>
                    <div className="land-queue-card__row">
                      <span>Matched &amp; En Route:</span>
                      <span className="land-queue-card__row-value land-queue-card__row-value--tertiary">
                        2 Donors Dispatched
                      </span>
                    </div>
                    <div className="land-queue-card__progress">
                      <div className="land-queue-card__progress-fill land-queue-card__progress-fill--secondary" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
                <button
                  className="land-queue-card__btn land-queue-card__btn--secondary"
                  type="button"
                  disabled={acceptedCards.card1}
                  onClick={() => acceptCard('card1', 'Match accepted — coordinator notified for Safdarjung Emergency Trauma')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {acceptedCards.card1 ? 'check_circle' : 'volunteer_activism'}
                  </span>
                  <span>{acceptedCards.card1 ? 'Match Accepted' : 'Accept SOS Match'}</span>
                </button>
              </div>

              <div className="land-queue-card">
                <div className="land-queue-card__stripe land-queue-card__stripe--secondary" />
                <div>
                  <div className="land-queue-card__top">
                    <span className="land-queue-card__group land-queue-card__group--muted">AB- NEGATIVE</span>
                    <span className="land-queue-card__expiry land-queue-card__expiry--secondary">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        timer
                      </span>
                      EXPIRES 52m
                    </span>
                  </div>
                  <h4 className="land-queue-card__hospital">KEM Hospital &amp; Medical College</h4>
                  <p className="land-queue-card__location">Parel, Mumbai · Pediatric Cardiovascular Unit</p>
                  <div className="land-queue-card__rows">
                    <div className="land-queue-card__row">
                      <span>Units Required:</span>
                      <span className="land-queue-card__row-value">2 Units Platelets</span>
                    </div>
                    <div className="land-queue-card__row">
                      <span>Matched &amp; En Route:</span>
                      <span className="land-queue-card__row-value land-queue-card__row-value--tertiary">
                        1 Donor Verified
                      </span>
                    </div>
                    <div className="land-queue-card__progress">
                      <div className="land-queue-card__progress-fill land-queue-card__progress-fill--primary" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
                <button
                  className="land-queue-card__btn land-queue-card__btn--primary"
                  type="button"
                  disabled={acceptedCards.card2}
                  onClick={() => acceptCard('card2', 'Match accepted — coordinator notified for KEM Hospital & Medical College')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {acceptedCards.card2 ? 'check_circle' : 'volunteer_activism'}
                  </span>
                  <span>{acceptedCards.card2 ? 'Match Accepted' : 'Accept SOS Match'}</span>
                </button>
              </div>

              <div className="land-queue-card">
                <div className="land-queue-card__stripe land-queue-card__stripe--tertiary" />
                <div>
                  <div className="land-queue-card__top">
                    <span className="land-queue-card__group land-queue-card__group--tertiary">BOMBAY (hh)</span>
                    <span className="land-queue-card__expiry land-queue-card__expiry--muted">NATIONAL REGISTRY</span>
                  </div>
                  <h4 className="land-queue-card__hospital">Apollo Hospitals, Greams Rd</h4>
                  <p className="land-queue-card__location">Chennai, Tamil Nadu · High Risk Organ Transplant</p>
                  <div className="land-queue-card__rows">
                    <div className="land-queue-card__row">
                      <span>Units Required:</span>
                      <span className="land-queue-card__row-value">1 Unit Whole Blood</span>
                    </div>
                    <div className="land-queue-card__row">
                      <span>Pan-India Donors Located:</span>
                      <span className="land-queue-card__row-value land-queue-card__row-value--tertiary">
                        3 Donors Paged (Flight Transit)
                      </span>
                    </div>
                    <div className="land-queue-card__progress">
                      <div className="land-queue-card__progress-fill land-queue-card__progress-fill--tertiary" style={{ width: '80%' }} />
                    </div>
                  </div>
                </div>
                <button
                  className="land-queue-card__btn land-queue-card__btn--bright"
                  type="button"
                  disabled={acceptedCards.card3}
                  onClick={() => acceptCard('card3', 'Flight transit coordination started for Apollo Hospitals, Greams Rd')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {acceptedCards.card3 ? 'check_circle' : 'verified'}
                  </span>
                  <span>{acceptedCards.card3 ? 'Transit Coordinated' : 'Coordinate Flight Transit'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="land-trust">
          <div className="land-section-inner">
            <div className="land-trust__card">
              <div className="land-trust__left">
                <span className="land-eyebrow land-eyebrow--tertiary">Government &amp; Clinical Backing</span>
                <h3 className="land-h2">Engineered for absolute zero-delay transparency.</h3>
                <p className="land-trust__desc">
                  BloodLink operates in compliance with the National Blood Transfusion Council (NBTC) guidelines. We
                  charge zero recipient fees, eliminate middle-tier black market blood brokerage, and encrypt donor
                  health data end-to-end.
                </p>
                <div className="land-trust__checks">
                  <div className="land-trust__check">
                    <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)' }}>
                      check_box
                    </span>
                    Non-Commercial Model
                  </div>
                  <div className="land-trust__check">
                    <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)' }}>
                      check_box
                    </span>
                    Ayushman Bharat Compliant
                  </div>
                  <div className="land-trust__check">
                    <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)' }}>
                      check_box
                    </span>
                    Automated Cold-Chain Log
                  </div>
                </div>
              </div>

              <div className="land-trust__metrics">
                <div className="land-trust__metric">
                  <span className="land-trust__metric-value land-trust__metric-value--tertiary">4.8m</span>
                  <span className="land-trust__metric-label">Average Match Time</span>
                </div>
                <div className="land-trust__metric">
                  <span className="land-trust__metric-value land-trust__metric-value--primary">50,000+</span>
                  <span className="land-trust__metric-label">Verified Donors</span>
                </div>
                <div className="land-trust__metric">
                  <span className="land-trust__metric-value">120+</span>
                  <span className="land-trust__metric-label">Partner ICUs</span>
                </div>
                <div className="land-trust__metric">
                  <span className="land-trust__metric-value land-trust__metric-value--secondary">100%</span>
                  <span className="land-trust__metric-label">Free &amp; Voluntary</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="land-cta-strip">
          <div className="land-cta-strip__inner">
            <h2 className="land-h2">Every second counts during acute trauma.</h2>
            <p className="land-cta-strip__desc">
              Join India's verified donor network today or register your hospital's emergency transfusion unit for
              instant automated allocation.
            </p>
            <div className="land-cta-strip__actions">
              <button
                className="land-cta-strip__btn land-cta-strip__btn--primary"
                type="button"
                onClick={() => navigate('/donors/req-1')}
              >
                Register as Volunteer Donor
              </button>
              <button
                className="land-cta-strip__btn land-cta-strip__btn--ghost"
                type="button"
                onClick={() => navigate('/transparency')}
              >
                Integrate Hospital Blood Bank
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="land-footer">
        <div className="land-footer__inner">
          <div className="land-footer__grid">
            <div className="land-footer__col">
              <div className="land-footer__brand">
                <div className="land-footer__brand-mark">
                  <span className="material-symbols-outlined" style={{ color: 'var(--land-secondary)', fontSize: 18 }}>
                    water_drop
                  </span>
                </div>
                <span className="land-footer__brand-name">BloodLink India</span>
              </div>
              <p className="land-footer__desc">
                Mission-critical emergency blood allocation network operating across 736 districts in India with
                sub-12 minute donor-hospital transit coordination.
              </p>
              <div className="land-footer__verified">
                <span className="material-symbols-outlined" style={{ color: 'var(--land-tertiary)', fontSize: 18 }}>
                  verified
                </span>
                <span>CDSCO Compliant Network</span>
              </div>
            </div>

            <div className="land-footer__col">
              <span className="land-footer__col-title">Pan-India Telemetry</span>
              <div className="land-footer__stat-grid">
                <div className="land-footer__stat">
                  <div className="land-footer__stat-value land-footer__stat-value--primary">736</div>
                  <div className="land-footer__stat-label">Districts Active</div>
                </div>
                <div className="land-footer__stat">
                  <div className="land-footer__stat-value land-footer__stat-value--tertiary">98.4%</div>
                  <div className="land-footer__stat-label">Fulfillment Rate</div>
                </div>
                <div className="land-footer__stat">
                  <div className="land-footer__stat-value">4,820+</div>
                  <div className="land-footer__stat-label">Verified Hospitals</div>
                </div>
                <div className="land-footer__stat">
                  <div className="land-footer__stat-value land-footer__stat-value--secondary">11.2m</div>
                  <div className="land-footer__stat-label">Avg Match Time</div>
                </div>
              </div>
            </div>

            <div className="land-footer__col">
              <span className="land-footer__col-title">Emergency Dispatch</span>
              <div className="land-footer__hotline">
                <div className="land-footer__hotline-title">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                    sos
                  </span>
                  24/7 National Emergency Hotline
                </div>
                <div className="land-footer__hotline-number">1800-BLOOD-LINK</div>
                <div className="land-footer__hotline-desc">
                  Immediate ICU, Trauma &amp; Thalassemia unit priority line.
                </div>
              </div>
            </div>

            <div className="land-footer__col">
              <span className="land-footer__col-title">Institutional Protocols</span>
              <div className="land-footer__links">
                <a onClick={() => navigate('/transparency')}>National Blood Transfusion Council Audit</a>
                <a onClick={() => navigate('/donors/req-1')}>Verified Donor Eligibility Grid</a>
                <a onClick={() => navigate('/dashboard')}>Hospital Cold-Chain Logistics</a>
                <a onClick={() => showToast('Data Protection & Ayushman Bharat API policy — coming soon')}>
                  Data Protection &amp; Ayushman Bharat API
                </a>
              </div>
            </div>
          </div>

          <div className="land-footer__bottom">
            <div className="land-footer__copyright">
              © 2025 BloodLink India Foundation. Central Blood Registry Division. Approved under MoHFW guidelines.
            </div>
            <div className="land-footer__badges">
              <span>ISO 27001 Certified</span>
              <span>NABH Accredited Labs</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
