import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import OpsShell from '../../components/OpsShell/OpsShell.jsx';
import { useRequests } from '../../context/RequestsContext.jsx';
import './Donors.css';

function initials(name) {
  return name
    .replace('.', '')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Donors() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    requests,
    getRequestById,
    getDonorsForRequest,
    setActiveRequestId,
    logResponse,
    respondAsDonor,
    getDonorResponse,
    responseLog,
  } = useRequests();

  const request = getRequestById(id) || requests[0];
  const donors = getDonorsForRequest(request.id);
  const primaryDonor = donors[0];

  useEffect(() => {
    setActiveRequestId(request.id);
  }, [request.id, setActiveRequestId]);

  const primaryStatus = primaryDonor ? getDonorResponse(request.id, primaryDonor.id) : null;

  function handleAccept() {
    if (!primaryDonor) return;
    respondAsDonor(request.id, primaryDonor.id, 'accepted');
    logResponse({
      text: `${primaryDonor.name} accepted emergency request for ${request.hospital} · Transit dispatched`,
      tone: 'accepted',
    });
  }

  function handleDecline() {
    if (primaryDonor) {
      respondAsDonor(request.id, primaryDonor.id, 'declined');
      logResponse({
        text: `${primaryDonor.name} unavailable · Dispatch cascade rerouted to next candidate`,
        tone: 'declined',
      });
    }
    navigate('/dashboard');
  }

  return (
    <OpsShell>
      <div className="donors-canvas">
        <section className="donors-subheader">
          <div className="donors-subheader__left">
            <div className="donors-subheader__badges">
              <span className="donors-live-badge">
                <span className="donors-live-badge__dot" />
                Live Dispatch Simulation
              </span>
              <span className="donors-incident-badge">Incident #{request.id.toUpperCase()}</span>
            </div>
            <h1 className="donors-title">Donor dispatch &amp; mobile broadcast view</h1>
            <p className="donors-subtitle">
              Simulating active donor push notification for Incident #{request.id.toUpperCase()} · {request.hospital} ·{' '}
              {request.group} verified match
            </p>
          </div>

          <div className="donors-subheader__right">
            <div className="donors-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#059669' }}>
                radar
              </span>
              <span className="donors-chip__label">Active Cluster:</span>
              <span className="donors-chip__value">{request.eligibleDonorsNearby} Monitored</span>
            </div>
            <div className="donors-chip">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#2563EB' }}>
                share_location
              </span>
              <span className="donors-chip__label">Broadcast Mode:</span>
              <span className="donors-chip__value">Phased (0-5 km)</span>
            </div>
          </div>
        </section>

        <div className="donors-grid">
          <div className="donors-phone-col">
            <div className="donors-phone-caption">
              Recipient Device Simulator{primaryDonor ? ` • ${primaryDonor.name} (${primaryDonor.distanceKm} km)` : ''}
            </div>

            <div className="donors-phone">
              <div className="donors-phone__rim" />
              <div className="donors-phone__screen">
                <div className="donors-phone__statusbar">
                  <span>14:28</span>
                  <div className="donors-phone__island" />
                  <div className="donors-phone__statusbar-right">
                    <span>5G</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      battery_5_bar
                    </span>
                  </div>
                </div>

                <div className="donors-phone__content">
                  <div className="donors-phone__appheader">
                    <div className="donors-phone__appheader-left">
                      <div className="donors-phone__app-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                          water_drop
                        </span>
                      </div>
                      <div>
                        <h4 className="donors-phone__app-name">BloodLink Emergency</h4>
                        <p className="donors-phone__app-sub">Automated Transit Dispatch</p>
                      </div>
                    </div>
                    <div className="donors-phone__verified-tag">
                      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
                        verified
                      </span>
                      <span>NBTC Match</span>
                    </div>
                  </div>

                  <div className="donors-phone__card">
                    <div className="donors-phone__card-strip" />
                    <div className="donors-phone__card-top">
                      <span className="donors-phone__alert-pill">
                        <span className="donors-phone__alert-dot" />
                        {request.group} URGENTLY NEEDED
                      </span>
                      <span className="donors-phone__just-now">Just now</span>
                    </div>

                    <div>
                      <h3 className="donors-phone__headline">
                        {request.hospital} needs {request.units} unit{request.units > 1 ? 's' : ''}
                      </h3>
                      <p className="donors-phone__desc">
                        You are a verified <strong>100% antigen match</strong>. Your donation can support {request.note.toLowerCase()}
                      </p>
                    </div>

                    <div className="donors-phone__chips">
                      <div className="donors-phone__mini-chip">
                        <span className="donors-phone__mini-chip-label">Group</span>
                        <span className="donors-phone__mini-chip-value donors-phone__mini-chip-value--red">
                          {request.group}
                        </span>
                      </div>
                      <div className="donors-phone__mini-chip">
                        <span className="donors-phone__mini-chip-label">Distance</span>
                        <span className="donors-phone__mini-chip-value">
                          {primaryDonor ? `${primaryDonor.distanceKm} km` : '—'}
                        </span>
                      </div>
                      <div className="donors-phone__mini-chip">
                        <span className="donors-phone__mini-chip-label">Eligibility</span>
                        <span className="donors-phone__mini-chip-value donors-phone__mini-chip-value--green">
                          Ready
                        </span>
                      </div>
                    </div>

                    <div className="donors-phone__transit-note">
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#16A34A' }}>
                        local_taxi
                      </span>
                      <span>Dedicated green-corridor transit arranged upon acceptance.</span>
                    </div>

                    {!primaryStatus && (
                      <div className="donors-phone__actions">
                        <button className="donors-phone__btn-accept" type="button" onClick={handleAccept}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                            check_circle
                          </span>
                          <span>Accept &amp; Begin Transit</span>
                        </button>
                        <button className="donors-phone__btn-decline" type="button" onClick={handleDecline}>
                          Decline / Not Available
                        </button>
                      </div>
                    )}

                    {primaryStatus === 'accepted' && (
                      <div className="donors-phone__feedback donors-phone__feedback--accepted">
                        <div className="donors-phone__feedback-title">
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                            task_alt
                          </span>
                          Transit Initiated • Cab #MH-02-EE-4190
                        </div>
                        <span className="donors-phone__feedback-sub">Estimated Pickup: 4 mins • OTP: 8841</span>
                      </div>
                    )}

                    <div className="donors-phone__compliance">
                      NBTC 90-day cooldown will apply post-donation • 100% voluntary &amp; free
                    </div>
                  </div>

                  <div className="donors-phone__home-indicator-wrap">
                    <div className="donors-phone__home-indicator" />
                  </div>
                </div>
              </div>
            </div>

            <div className="donors-phone-hint">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                touch_app
              </span>
              <span>Click "Accept" on the simulator to trigger interactive sync</span>
            </div>
          </div>

          <div className="donors-ops-col">
            <div className="donors-card">
              <div className="donors-card__header">
                <div>
                  <div className="donors-card__title-row">
                    <h2 className="donors-card__title">Matched Donors — {request.group}</h2>
                    <span className="donors-card__count">{donors.length} in radius</span>
                  </div>
                  <p className="donors-card__subtitle">Ranked by proximity and NBTC eligibility window</p>
                </div>
                <div className="donors-broadcast-badge">
                  <span className="donors-broadcast-badge__dot" />
                  <span>Active Broadcast</span>
                </div>
              </div>

              <div className="donors-list">
                {donors.map((donor) => {
                  const status = getDonorResponse(request.id, donor.id);
                  return (
                    <div key={donor.id} className={`donors-row ${!donor.eligible ? 'donors-row--dim' : ''}`}>
                      <div className="donors-row__left">
                        <div className="donors-row__avatar">{initials(donor.name)}</div>
                        <div>
                          <div className="donors-row__name-line">
                            <span className="donors-row__name">{donor.name}</span>
                          </div>
                          <div className="donors-row__meta">
                            <span className="donors-row__meta-item">
                              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
                                near_me
                              </span>
                              {donor.distanceKm} km
                            </span>
                            <span>•</span>
                            <span>Last donated {donor.lastDonatedAgo}</span>
                          </div>
                        </div>
                      </div>
                      <div className="donors-row__right">
                        {status === 'accepted' ? (
                          <span className="donors-pill donors-pill--accepted">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                              check
                            </span>
                            Accepted
                          </span>
                        ) : status === 'declined' ? (
                          <span className="donors-pill donors-pill--declined">Declined</span>
                        ) : donor.eligible ? (
                          <span className="donors-pill donors-pill--eligible">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                              check
                            </span>
                            Eligible
                          </span>
                        ) : (
                          <span className="donors-pill donors-pill--waiting">Not yet eligible</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="donors-card">
              <div className="donors-card__header">
                <div className="donors-card__title-row">
                  <h3 className="donors-card__title">Response Log</h3>
                  <span className="donors-live-sync">
                    <span className="donors-live-sync__dot" />
                    Live broadcast sync
                  </span>
                </div>
              </div>

              <div className="donors-log">
                {responseLog.length === 0 && (
                  <div className="donors-log__empty">No responses logged yet for this dispatch cycle.</div>
                )}
                {responseLog.map((entry) => (
                  <div
                    key={entry.id}
                    className={`donors-log-item ${entry.tone === 'accepted' ? 'donors-log-item--accepted' : entry.tone === 'declined' ? 'donors-log-item--declined' : ''}`}
                  >
                    <span className="donors-log-item__time">
                      {entry.time.toTimeString().split(' ')[0]}
                    </span>
                    <span
                      className={`donors-log-item__dot ${
                        entry.tone === 'accepted'
                          ? 'donors-log-item__dot--green'
                          : entry.tone === 'declined'
                          ? 'donors-log-item__dot--red'
                          : 'donors-log-item__dot--blue'
                      }`}
                    />
                    <div className="donors-log-item__text">{entry.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="donors-trust-strip">
          <div className="donors-trust-strip__left">
            <div className="donors-trust-strip__icon">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                shield_with_heart
              </span>
            </div>
            <div>
              <div className="donors-trust-strip__title">
                National Blood Transfusion Council (NBTC) Protocol Compliant
              </div>
              <div className="donors-trust-strip__desc">
                Donor privacy preserved under end-to-end tokenized telephone proxy routing. Zero commercial brokerage.
              </div>
            </div>
          </div>
          <div className="donors-trust-strip__right">
            <span>NODE: BOM-WEST-04</span>
            <span>ENCRYPTION: SHA-256</span>
          </div>
        </section>
      </div>
    </OpsShell>
  );
}
