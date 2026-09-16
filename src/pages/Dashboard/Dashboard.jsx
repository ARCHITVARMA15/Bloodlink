import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequests } from '../../context/RequestsContext.jsx';
import { useToast } from '../../components/Toast/Toast.jsx';
import './Dashboard.css';

function formatHMS(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function initials(name) {
  return name
    .replace('.', '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function subLabel(request) {
  if (request.component === 'Plasma') return 'Plasma';
  if (request.group === 'O−') return 'Univ';
  return 'Group';
}

function riskLabel(risk) {
  if (risk === 'high') return { text: 'Critical deficit', className: 'coral' };
  if (risk === 'moderate') return { text: 'Moderate risk', className: 'amber' };
  return { text: 'Optimal stock', className: 'emerald' };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const showToast = useToast();
  const {
    requests,
    getDonorsForRequest,
    forecastZone,
    setActiveRequestId,
    respondAsDonor,
    getDonorResponse,
  } = useRequests();

  const eligibleDonors = getDonorsForRequest('req-1');
  const [secondsAgo, setSecondsAgo] = useState(14);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  function openRequest(id) {
    setActiveRequestId(id);
    navigate(`/alerts/${id}`);
  }

  function refreshQueue() {
    setRefreshing(true);
    setSecondsAgo(0);
    showToast('Queue refreshed — all requests re-scanned');
    setTimeout(() => setRefreshing(false), 700);
  }

  function broadcastSOS() {
    const critical = requests.find((r) => r.urgency === 'Critical') || requests[0];
    showToast(`New SOS broadcast queued for ${critical.hospital}`);
    setActiveRequestId(critical.id);
    navigate(`/alerts/${critical.id}`);
  }

  function pageAllEligible() {
    const toPage = eligibleDonors.filter(
      (d) => d.eligible && !getDonorResponse('req-1', d.id),
    );
    toPage.forEach((d) => respondAsDonor('req-1', d.id, 'paged'));
    showToast(
      toPage.length > 0
        ? `Paged ${toPage.length} eligible donor${toPage.length > 1 ? 's' : ''} directly`
        : 'All eligible donors already paged',
    );
  }

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-header__left">
          <div className="dash-brand" onClick={() => navigate('/')} role="button" tabIndex={0}>
            <div className="dash-brand__mark">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#C9524B">
                <path d="M12 21.5C7.5 21.5 4 18 4 13.5C4 9.5 9.5 3.5 12 1C14.5 3.5 20 9.5 20 13.5C20 18 16.5 21.5 12 21.5Z" />
                <circle cx="12" cy="14" r="2.2" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="dash-brand__text">
              <span className="dash-brand__name">
                Blood<span className="dash-brand__accent">Link</span>
              </span>
              <span className="dash-brand__badge">OPS-CONSOLE</span>
            </div>
          </div>

          <nav className="dash-nav">
            <a className="dash-nav__link dash-nav__link--active" onClick={() => navigate('/dashboard')}>
              Dashboard
            </a>
            <a className="dash-nav__link" onClick={() => navigate(`/alerts/${requests[0].id}`)}>
              <span>Alerts</span>
              <span className="dash-nav__dot" />
            </a>
            <a className="dash-nav__link" onClick={() => navigate(`/donors/${requests[0].id}`)}>
              Donors
            </a>
            <a className="dash-nav__link" onClick={() => navigate('/transparency')}>
              Transparency
            </a>
          </nav>
        </div>

        <div className="dash-header__right">
          <div className="dash-live-pill">
            <span className="dash-live-dot">
              <span className="dash-live-dot__ping" />
              <span className="dash-live-dot__core" />
            </span>
            <span>Live</span>
            <span className="dash-live-pill__sep">|</span>
            <span className="dash-live-pill__ms">140ms</span>
          </div>
          <div className="dash-station">
            <span className="dash-station__name">Andheri West Node</span>
            <span className="dash-station__id">DISPATCH #882</span>
          </div>
          <div className="dash-avatar">SK</div>
        </div>
      </header>

      <div className="dash-subheader">
        <div>
          <div className="dash-subheader__title-row">
            <h1 className="dash-subheader__title">Live requests, Andheri zone</h1>
            <span className="dash-geo-badge">GEO: MH-02</span>
          </div>
          <p className="dash-subheader__meta">
            <span>{requests.length} active emergency requests</span>
            <span className="dash-dot-sep">•</span>
            <span>
              Last scanned <span className="dash-subheader__meta-strong">{formatHMS(secondsAgo)} ago</span>
            </span>
            <span className="dash-dot-sep">•</span>
            <span className="dash-subheader__grid-ok">Grid status: nominal</span>
          </p>
        </div>

        <div className="dash-actions">
          <div className="dash-transit-pill">
            <span className="dash-transit-pill__dot" />
            <span>Avg Transit: 11.4m</span>
          </div>
          <button className="dash-btn dash-btn--ghost" type="button" onClick={refreshQueue}>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 15, animation: refreshing ? 'dash-spin 0.7s linear' : 'none' }}
            >
              refresh
            </span>
            <span>Refresh Queue</span>
          </button>
          <button className="dash-btn dash-btn--danger" type="button" onClick={broadcastSOS}>
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              campaign
            </span>
            <span>Broadcast SOS</span>
          </button>
        </div>
      </div>

      <main className="dash-main">
        <div className="dash-col dash-col--left">
          <section className="dash-card">
            <div className="dash-card__header">
              <div className="dash-card__header-left">
                <h2 className="dash-card__title">Active Emergency Requests</h2>
                <span className="dash-pill-count">{requests.length} live</span>
              </div>
              <span className="dash-card__hint">Filtered by: Distance &lt; 6.5 km</span>
            </div>

            <div className="dash-rows">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="dash-request-row"
                  onClick={() => openRequest(req.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openRequest(req.id)}
                >
                  <div className="dash-request-row__left">
                    <div className="dash-request-row__badge">
                      <span className="dash-request-row__badge-group">{req.group}</span>
                      <span className="dash-request-row__badge-sub">{subLabel(req)}</span>
                    </div>
                    <div>
                      <div className="dash-request-row__title-line">
                        <h3 className="dash-request-row__hospital">{req.hospital}</h3>
                        <span className="dash-request-row__tag">{req.area}</span>
                      </div>
                      <div className="dash-request-row__meta">
                        <span className="dash-request-row__units">
                          {req.units} unit{req.units > 1 ? 's' : ''}
                        </span>
                        <span className="dash-dot-sep">•</span>
                        <span>{req.component}</span>
                        <span className="dash-dot-sep">•</span>
                        <span>posted {req.postedMinAgo}m ago</span>
                      </div>
                      <div className="dash-request-row__sub">
                        <span className="dash-request-row__notified">
                          {req.donorsNotified} donors notified
                        </span>
                        <span className="dash-dot-sep">•</span>
                        <span>Req ID #{req.id.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="dash-request-row__right">
                    <span
                      className={`dash-urgency-badge dash-urgency-badge--${
                        req.urgency === 'Critical' ? 'critical' : 'medium'
                      }`}
                    >
                      {req.urgency}
                    </span>
                    <span className="dash-eta">
                      ETA window <span className="dash-eta__value">{req.etaMin}m</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-card__footer">
              <span>Auto-matching active across 14 ICUs</span>
              <a
                className="dash-card__footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('Historical allocations archive — 118 records this month');
                }}
              >
                <span>View historical allocations</span>
                <span>&rarr;</span>
              </a>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card__header">
              <div className="dash-card__header-left">
                <h2 className="dash-card__title">Nearby Verified Donors</h2>
                <span className="dash-live-count">
                  <span className="dash-live-count__dot" />
                  <span>13 Active in 4km radius</span>
                </span>
              </div>
              <button
                className="dash-map-btn"
                type="button"
                onClick={() => showToast('Map re-centered on Andheri Link Rd')}
              >
                Centering: Andheri Link Rd
              </button>
            </div>

            <div className="dash-map dot-grid">
              <div className="dash-map__watermark dash-map__watermark--tl">
                GRID: 19.1136° N, 72.8697° E • SCALE 1:12000
              </div>
              <div className="dash-map__watermark dash-map__watermark--br">
                RADIAL RINGS: 1.5KM / 3.0KM / 4.5KM
              </div>

              <div className="dash-map__ring dash-map__ring--1" />
              <div className="dash-map__ring dash-map__ring--2" />
              <div className="dash-map__ring dash-map__ring--3" />

              <svg className="dash-map__svg" viewBox="0 0 700 288" fill="none">
                <path
                  d="M-20 180 C 180 180, 240 120, 350 140 C 440 155, 520 80, 720 100"
                  stroke="#1C273C"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path d="M180 -10 L 220 300" stroke="#162032" strokeWidth="4" strokeDasharray="4 4" />
                <path d="M480 -10 L 460 300" stroke="#162032" strokeWidth="4" strokeDasharray="4 4" />
                <path
                  d="M 190 95 C 240 105, 300 130, 360 140"
                  stroke="#3E6E8E"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  opacity="0.8"
                />
                <path
                  d="M 360 140 C 420 150, 470 120, 520 125"
                  stroke="#C9524B"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                  opacity="0.9"
                />
              </svg>

              <div className="dash-pin dash-pin--critical" style={{ top: 82, left: 175 }}>
                <div className="dash-pin__ring">
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#EF6E66' }}>
                    emergency
                  </span>
                </div>
                <div className="dash-pin__label dash-pin__label--critical">City Hospital ICU (O−)</div>
              </div>

              <div className="dash-pin dash-pin--donor" style={{ top: 125, left: 345 }}>
                <div className="dash-pin__ring dash-pin__ring--sm">
                  <span className="dash-pin__core" />
                </div>
                <div className="dash-pin__label dash-pin__label--donor dash-pin__label--below">Donor AK (1.2km)</div>
              </div>

              <div className="dash-pin dash-pin--donor" style={{ top: 50, left: 430 }}>
                <div className="dash-pin__ring dash-pin__ring--sm">
                  <span className="dash-pin__core" />
                </div>
                <div className="dash-pin__label dash-pin__label--donor">Donor MS (2.3km)</div>
              </div>

              <div className="dash-pin dash-pin--hub" style={{ top: 110, left: 515 }}>
                <div className="dash-pin__ring dash-pin__ring--md">
                  <span className="dash-pin__hub-text">HUB</span>
                </div>
                <div className="dash-pin__label dash-pin__label--hub">Sanjeevani Blood Bank</div>
              </div>

              <div className="dash-pin dash-pin--amber" style={{ top: 180, left: 270 }}>
                <div className="dash-pin__ring dash-pin__ring--md">
                  <span className="dash-pin__amber-text">B+</span>
                </div>
                <div className="dash-pin__label dash-pin__label--amber dash-pin__label--below">
                  Sanjeevani (B+)
                </div>
              </div>

              <div className="dash-pin dash-pin--transit" style={{ top: 125, left: 275 }}>
                <div className="dash-transit-chip">
                  <span className="dash-transit-chip__dot" />
                  <span>MED-TRANSIT #04 (45 km/h)</span>
                </div>
              </div>
            </div>

            <div className="dash-map-legend">
              <div className="dash-map-legend__items">
                <div className="dash-map-legend__item">
                  <span className="dash-map-legend__dot dash-map-legend__dot--coral" />
                  <span>ICU Emergency</span>
                </div>
                <div className="dash-map-legend__item">
                  <span className="dash-map-legend__dot dash-map-legend__dot--emerald" />
                  <span>Verified On-Call</span>
                </div>
                <div className="dash-map-legend__item">
                  <span className="dash-map-legend__dot dash-map-legend__dot--teal" />
                  <span>Blood Bank Depot</span>
                </div>
              </div>
              <div className="dash-map-legend__note">Transit mesh: Green corridor active via JVPD Link Rd</div>
            </div>
          </section>
        </div>

        <div className="dash-col dash-col--right">
          <section className="dash-card">
            <div className="dash-card__header">
              <div className="dash-card__header-left">
                <h2 className="dash-card__title">Eligible Donors</h2>
                <span className="dash-pill-count">{eligibleDonors.length} prioritized</span>
              </div>
              <span className="dash-card__hint">Sorted by Proximity</span>
            </div>

            <div className="dash-rows">
              {eligibleDonors.map((donor) => {
                const response = getDonorResponse('req-1', donor.id);
                const label = response === 'paged' ? 'Paged' : donor.eligible ? 'Available' : 'Standby';
                const variant =
                  response === 'paged' ? 'paged' : donor.eligible ? 'available' : 'standby';
                return (
                  <div key={donor.id} className="dash-donor-row">
                    <div className="dash-donor-row__left">
                      <div className="dash-donor-row__avatar">{initials(donor.name)}</div>
                      <div>
                        <div className="dash-donor-row__name-line">
                          <span className="dash-donor-row__name">{donor.name}</span>
                          <span className="dash-donor-row__group">O−</span>
                        </div>
                        <div className="dash-donor-row__meta">
                          <span>{donor.distanceKm} km away</span>
                          <span className="dash-dot-sep">•</span>
                          <span>last donated {donor.lastDonatedAgo}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`dash-status-pill dash-status-pill--${variant}`}>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="dash-card__footer">
              <span>NBTC 90-day cooldown enforced</span>
              <button
                className="dash-card__footer-link dash-card__footer-link--btn"
                type="button"
                onClick={pageAllEligible}
              >
                Direct Page All &rarr;
              </button>
            </div>
          </section>

          <section className="dash-card">
            <div className="dash-card__header">
              <div className="dash-card__header-left">
                <h2 className="dash-card__title">Blood Stock</h2>
                <span className="dash-card__hint">{forecastZone.name}</span>
              </div>
              <span className="dash-card__hint dash-card__hint--muted">Forecast</span>
            </div>

            <div className="dash-stock-list">
              {forecastZone.groups.map((g) => {
                const rl = riskLabel(g.risk);
                return (
                  <div className="dash-stock-row" key={g.group}>
                    <div className="dash-stock-row__top">
                      <div className="dash-stock-row__label">
                        <span className="dash-stock-row__group">{g.group}</span>
                        <span className="dash-stock-row__pct">{g.pct}%</span>
                      </div>
                      <span className={`dash-stock-row__risk dash-stock-row__risk--${rl.className}`}>
                        {rl.text}
                      </span>
                    </div>
                    <div className="dash-stock-row__bar">
                      <div
                        className={`dash-stock-row__bar-fill dash-stock-row__bar-fill--${rl.className}`}
                        style={{ width: `${g.pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="dash-card__footer">
              <span>Cold-chain telemetry: 3.8°C verified</span>
              <a
                className="dash-card__footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  showToast('e-RaktKosh sync verified — last pull 2 min ago');
                }}
              >
                e-RaktKosh Sync: Active
              </a>
            </div>
          </section>
        </div>
      </main>

      <footer className="dash-footer">
        <div className="dash-footer__left">
          <span className="dash-footer__item">
            <span className="dash-footer__dot" />
            <span>ICU BRIDGE: 14 CONNECTED</span>
          </span>
          <span>•</span>
          <span>NBTC PROTOCOL v4.2</span>
          <span>•</span>
          <span>DISPATCH ENCRYPTION: AES-256</span>
        </div>
        <div className="dash-footer__right">
          <span>SERVER LATENCY: 18ms</span>
          <span>•</span>
          <span>UTC+05:30 IST</span>
        </div>
      </footer>
    </div>
  );
}
