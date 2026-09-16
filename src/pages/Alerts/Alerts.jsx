import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpsShell from '../../components/OpsShell/OpsShell.jsx';
import { useRequests } from '../../context/RequestsContext.jsx';
import { useToast } from '../../components/Toast/Toast.jsx';
import './Alerts.css';

function formatCountdown(totalSeconds) {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function Alerts() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const { requests, getRequestById, setActiveRequestId, escalateRequest, isEscalated } = useRequests();

  const request = getRequestById(id) || requests[0];
  const [telemetryOpen, setTelemetryOpen] = useState(true);
  const [silenced, setSilenced] = useState(false);
  const [countdown, setCountdown] = useState(
    request.autoEscalateAtMin ? request.autoEscalateAtMin * 60 : null,
  );

  useEffect(() => {
    setActiveRequestId(request.id);
    setCountdown(request.autoEscalateAtMin ? request.autoEscalateAtMin * 60 : null);
  }, [request.id, request.autoEscalateAtMin, setActiveRequestId]);

  useEffect(() => {
    if (countdown === null) return undefined;
    const t = setInterval(() => {
      setCountdown((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
    }, 1000);
    return () => clearInterval(t);
  }, [countdown === null]);

  const escalated = isEscalated(request.id);
  const unresolvedCount = requests.length;

  function selectRequest(reqId) {
    setActiveRequestId(reqId);
    navigate(`/alerts/${reqId}`);
  }

  return (
    <OpsShell>
      <div className="alerts">
        <section className="alerts-subheader">
          <div className="alerts-subheader__left">
            <div className="alerts-subheader__title-row">
              <h1 className="alerts-subheader__title">Active alerts, Andheri zone</h1>
              <span className="alerts-geo-badge">
                <span className="alerts-geo-badge__dot" />
                GEO: MH-02
              </span>
              <span className="alerts-zone-badge">Zone Sector 4</span>
            </div>
            <p className="alerts-subheader__meta">
              <span className="alerts-subheader__ping" />
              <span>{unresolvedCount} unresolved emergency dispatches</span>
              <span className="alerts-dot-sep">•</span>
              <span className="alerts-subheader__meta-accent">Auto-escalation timer active</span>
            </p>
          </div>

          <div className="alerts-subheader__right">
            <div className="alerts-threshold-pill">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                timer
              </span>
              <span>Triage threshold:</span>
              <span className="alerts-threshold-pill__value">&lt; 45m</span>
            </div>
            <button
              className={`alerts-btn alerts-btn--ghost ${silenced ? 'alerts-btn--active' : ''}`}
              type="button"
              onClick={() => setSilenced((s) => !s)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                notifications_paused
              </span>
              <span>{silenced ? 'Non-critical silenced' : 'Silence non-critical'}</span>
            </button>
            <button
              className="alerts-btn alerts-btn--primary"
              type="button"
              onClick={() => showToast('New emergency SOS broadcast queued for Andheri zone')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                add_alert
              </span>
              <span>New emergency SOS</span>
            </button>
          </div>
        </section>

        <div className="alerts-grid">
          <div className="alerts-hero-col">
            <div className="alerts-hero">
              <div className="alerts-hero__glow" />
              <div className="alerts-hero__topbar">
                <div className="alerts-hero__topbar-left">
                  <span className="alerts-priority-badge">
                    <span className="alerts-priority-badge__ping" />
                    {request.urgency} · Priority {request.urgency === 'Critical' ? 1 : 2}
                  </span>
                  <span className="alerts-corridor-tag">{request.area} Corridor</span>
                </div>
                <div className="alerts-hero__topbar-right">
                  <span className="alerts-req-id">REQ #{request.id.toUpperCase()}</span>
                  <span>•</span>
                  <span>Broadcast {request.postedMinAgo}m ago</span>
                </div>
              </div>

              <div className="alerts-hero__body">
                <h2 className="alerts-hero__headline">
                  {request.group} needed within {request.etaMin + 12} minutes — {request.hospital}
                </h2>
                <p className="alerts-hero__desc">
                  {request.note} {request.units} unit{request.units > 1 ? 's' : ''} {request.component} required
                  immediately.
                  {request.group === 'O−' && ' Universal donor protocol engaged under NBTC statutory fast-track directive.'}
                </p>
              </div>

              <div className="alerts-stats">
                <div className="alerts-stat">
                  <div className="alerts-stat__top">
                    <span className="alerts-stat__label">Eligible donors</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary)' }}>
                      groups
                    </span>
                  </div>
                  <div className="alerts-stat__value">
                    {request.eligibleDonorsNearby} <span className="alerts-stat__unit">on grid</span>
                  </div>
                  <span className="alerts-stat__foot alerts-stat__foot--tertiary">
                    <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                      near_me
                    </span>
                    within immediate service radius
                  </span>
                </div>
                <div className="alerts-stat alerts-stat--bordered">
                  <div className="alerts-stat__top">
                    <span className="alerts-stat__label">Nearest stock</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--primary)' }}>
                      inventory_2
                    </span>
                  </div>
                  <div className="alerts-stat__value">
                    {request.nearestStock.onSite ? 'On-site' : `${request.nearestStock.distanceKm} km`}
                  </div>
                  <span className="alerts-stat__foot">{request.nearestStock.label}</span>
                </div>
                <div className="alerts-stat alerts-stat--bordered">
                  <div className="alerts-stat__top">
                    <span className="alerts-stat__label">ETA if confirmed</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 15, color: 'var(--tertiary)' }}>
                      speed
                    </span>
                  </div>
                  <div className="alerts-stat__value alerts-stat__value--tertiary">{request.etaMin} min</div>
                  <span className="alerts-stat__foot alerts-stat__foot--primary">
                    <span className="alerts-stat__foot-dot" />
                    Green corridor transit route
                  </span>
                </div>
              </div>

              <div className="alerts-response-bar">
                <div className="alerts-response-bar__left">
                  <span className="alerts-response-bar__dot" />
                  <span className="alerts-response-bar__text">
                    {request.donorsNotified} donors notified · awaiting response
                  </span>
                </div>
                <div className="alerts-response-bar__right">
                  <div className="alerts-response-bar__counts">
                    <span className="alerts-response-bar__count-primary">
                      {request.donorsNotified} delivered
                    </span>
                    <span>•</span>
                    <span>0 accepted yet</span>
                  </div>
                  {request.autoEscalateAtMin && countdown !== null && (
                    <div className="alerts-countdown-badge">
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        hourglass_top
                      </span>
                      <span>
                        Auto-escalate in <span>{formatCountdown(countdown)}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="alerts-dispatch-actions">
                <div className="alerts-dispatch-actions__left">
                  <button
                    className={`alerts-action-btn alerts-action-btn--primary ${
                      escalated ? 'alerts-action-btn--done' : ''
                    }`}
                    type="button"
                    disabled={escalated}
                    onClick={() => escalateRequest(request.id)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      {escalated ? 'check_circle' : 'publish'}
                    </span>
                    <span>{escalated ? 'Escalated ✓' : 'Escalate to Nearby Banks'}</span>
                  </button>
                  <button
                    className="alerts-action-btn alerts-action-btn--ghost"
                    type="button"
                    onClick={() => navigate(`/donors/${request.id}`)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                      person_search
                    </span>
                    <span>Open Donor View</span>
                  </button>
                </div>
                <a
                  className="alerts-log-link"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast(`Full incident log opened for REQ #${request.id.toUpperCase()}`);
                  }}
                >
                  <span>View Full Incident Log</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            <div className="alerts-telemetry">
              <button
                className="alerts-telemetry__toggle"
                type="button"
                onClick={() => setTelemetryOpen((o) => !o)}
              >
                <div className="alerts-telemetry__toggle-left">
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>
                    hub
                  </span>
                  <span className="alerts-telemetry__title">Real-time telemetry &amp; transit bridge</span>
                  <span className="alerts-telemetry__live-badge">LIVE TELEMETRY ACTIVE</span>
                </div>
                <div className="alerts-telemetry__toggle-right">
                  <span>Latency: 14ms</span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 18, transform: telemetryOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
                  >
                    expand_less
                  </span>
                </div>
              </button>

              {telemetryOpen && (
                <div className="alerts-telemetry__body">
                  <div className="alerts-timeline">
                    <div className="alerts-timeline__item">
                      <span className="alerts-timeline__dot alerts-timeline__dot--done" />
                      <div>
                        <p className="alerts-timeline__label">SOS ingested via hospital API</p>
                        <span className="alerts-timeline__sub">
                          Payload validated: {request.group} • Component: {request.component}
                        </span>
                      </div>
                      <span className="alerts-timeline__time alerts-timeline__time--done">00:00</span>
                    </div>
                    <div className="alerts-timeline__item">
                      <span className="alerts-timeline__dot alerts-timeline__dot--done" />
                      <div>
                        <p className="alerts-timeline__label">
                          Geospatial radius match identified {request.eligibleDonorsNearby} donors
                        </p>
                        <span className="alerts-timeline__sub">Clustered across {request.area} ward network</span>
                      </div>
                      <span className="alerts-timeline__time alerts-timeline__time--done">00:42</span>
                    </div>
                    <div className="alerts-timeline__item">
                      <span className="alerts-timeline__dot alerts-timeline__dot--done" />
                      <div>
                        <p className="alerts-timeline__label">Automated dispatch pushed to tier-1 donors</p>
                        <span className="alerts-timeline__sub">
                          Direct SMS + Push Token verification broadcast (priority override active)
                        </span>
                      </div>
                      <span className="alerts-timeline__time alerts-timeline__time--done">01:15</span>
                    </div>
                    <div className="alerts-timeline__item">
                      <span className="alerts-timeline__dot alerts-timeline__dot--active" />
                      <div>
                        <p className="alerts-timeline__label alerts-timeline__label--active">
                          Current stage: Awaiting biometrics/acceptance
                        </p>
                        <span className="alerts-timeline__sub">
                          Escalation countdown {escalated ? 'triggered' : 'armed'} to nearby blood banks
                        </span>
                      </div>
                      <span className="alerts-timeline__time alerts-timeline__time--active">IN TRANSIT</span>
                    </div>
                  </div>

                  <div className="alerts-corridor-readout">
                    <div>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>
                        traffic
                      </span>
                      <span>
                        {request.area} traffic signal sync:{' '}
                        <strong>READY (PRIORITY CORRIDOR-A)</strong>
                      </span>
                    </div>
                    <div className="alerts-corridor-readout__right">
                      <span>
                        Telemetry Ping: <strong>99.8%</strong>
                      </span>
                      <span>•</span>
                      <span className="alerts-corridor-readout__secure">AES-GCM Authenticated</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="alerts-queue-col">
            <div className="alerts-queue">
              <div className="alerts-queue__header">
                <div className="alerts-queue__header-left">
                  <h3 className="alerts-queue__title">Queue</h3>
                  <span className="alerts-queue__count">{requests.length} Active</span>
                </div>
                <div className="alerts-queue__sort">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                    sort
                  </span>
                  <span>Priority</span>
                </div>
              </div>

              <div className="alerts-queue__rows">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className={`alerts-queue-row ${req.id === request.id ? 'alerts-queue-row--active' : ''} ${
                      req.urgency === 'Critical' ? 'alerts-queue-row--critical' : 'alerts-queue-row--medium'
                    }`}
                    onClick={() => selectRequest(req.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && selectRequest(req.id)}
                  >
                    <div className="alerts-queue-row__top">
                      <div className="alerts-queue-row__left">
                        <span className="alerts-queue-row__chip">{req.group}</span>
                        <div className="alerts-queue-row__info">
                          <span className="alerts-queue-row__hospital">{req.hospital}</span>
                          <span className="alerts-queue-row__units">
                            {req.units} unit{req.units > 1 ? 's' : ''} {req.component}
                          </span>
                        </div>
                      </div>
                      <div className="alerts-queue-row__meta">
                        <span
                          className={`alerts-queue-row__urgency ${
                            req.urgency === 'Critical'
                              ? 'alerts-queue-row__urgency--critical'
                              : 'alerts-queue-row__urgency--medium'
                          }`}
                        >
                          {req.urgency.toUpperCase()}
                        </span>
                        <span className="alerts-queue-row__time">{req.postedMinAgo}m ago</span>
                      </div>
                    </div>
                    <div className="alerts-queue-row__bottom">
                      <span>{req.id === request.id ? 'Active Hero View' : `${req.eligibleDonorsNearby} donors nearby`}</span>
                      <span className="alerts-queue-row__status">
                        {isEscalated(req.id) ? 'Escalated ✓' : `${req.donorsNotified} notified`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="alerts-queue__footer">
                <span>NBTC protocol auto-purge: 2h</span>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('18 resolved dispatches archived today');
                  }}
                >
                  <span>Archive / Resolved (18 today)</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            <div className="alerts-triage-widget">
              <div>
                <span className="alerts-triage-widget__dot" />
                <span>
                  Auto-dispatch cluster: <strong>Node-Andheri-W</strong>
                </span>
              </div>
              <span className="alerts-triage-widget__status">STABLE</span>
            </div>
          </aside>
        </div>
      </div>
    </OpsShell>
  );
}
