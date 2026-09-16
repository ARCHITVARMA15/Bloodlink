import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsShell from '../../components/OpsShell/OpsShell.jsx';
import { riskForPct, useRequests } from '../../context/RequestsContext.jsx';
import { useToast } from '../../components/Toast/Toast.jsx';
import './Transparency.css';

const FILTERS = ['O−', 'B+', 'AB−'];

const STOCK_COLUMNS = ['A+', 'B+', 'O−', 'AB+'];

function riskMeta(risk) {
  if (risk === 'high') return { label: 'Critical', sub: 'Critical deficit', className: 'high' };
  if (risk === 'moderate') return { label: 'Moderate', sub: 'Monitored', className: 'moderate' };
  return { label: 'Stable', sub: 'Full stock', className: 'stable' };
}

export default function Transparency() {
  const navigate = useNavigate();
  const showToast = useToast();
  const { bloodBanks, requests, getRequestById, setActiveRequestId } = useRequests();
  const [activeFilter, setActiveFilter] = useState('O−');

  const filterCounts = useMemo(() => {
    const counts = {};
    FILTERS.forEach((f) => {
      counts[f] = requests.filter((r) => r.group === f).length;
    });
    return counts;
  }, [requests]);

  function openBankRequest(requestId) {
    setActiveRequestId(requestId);
    navigate(`/alerts/${requestId}`);
  }

  return (
    <OpsShell>
      <div className="trans-canvas">
        <header className="trans-header">
          <div className="trans-header__left">
            <div className="trans-header__badges">
              <span className="trans-node-badge">
                <span className="trans-node-badge__dot" />
                Public Node Telemetry
              </span>
              <span className="trans-node-sub">MH-ZONE-02 · CENTRAL HUB</span>
            </div>
            <h1 className="trans-title">Public availability</h1>
            <p className="trans-subtitle">See exactly what's available in local cold chains, before you call.</p>
          </div>

          <div className="trans-header__right">
            <div className="trans-sync-pill">
              <span className="trans-sync-dot">
                <span className="trans-sync-dot__ping" />
                <span className="trans-sync-dot__core" />
              </span>
              <span className="trans-sync-pill__text">Live, synced every 5 min</span>
              <span className="trans-sync-pill__sep">|</span>
              <span className="trans-sync-pill__time">Last sync 14:32:08 IST</span>
            </div>
            <div className="trans-location-pill">
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#94a3b8' }}>
                location_on
              </span>
              <span className="trans-location-pill__text">Andheri &amp; Western Suburbs (5km)</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#94a3b8' }}>
                expand_more
              </span>
            </div>
          </div>
        </header>

        <section className="trans-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`trans-filter-btn ${activeFilter === f ? 'trans-filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              <span className="trans-filter-btn__dot" />
              <span className="trans-filter-btn__group">{f}</span>
              <span className="trans-filter-btn__sep">·</span>
              <span className="trans-filter-btn__meta">
                {filterCounts[f] > 0 ? `open request (${filterCounts[f]})` : 'no open request'}
              </span>
            </button>
          ))}
        </section>

        <main className="trans-stack">
          {bloodBanks.map((bank) => {
            const linkedRequest = getRequestById(bank.linkedRequestId);
            const showOpenRequestBadge = linkedRequest && linkedRequest.group === activeFilter;

            return (
              <article
                key={bank.id}
                className={`trans-card ${showOpenRequestBadge ? 'trans-card--urgent' : 'trans-card--calm'}`}
              >
                <div className={`trans-card__stripe ${showOpenRequestBadge ? 'trans-card__stripe--rose' : 'trans-card__stripe--emerald'}`} />

                <div className="trans-card__top">
                  <div className="trans-card__title-row">
                    <h2 className="trans-card__title">{bank.name}</h2>
                    <span className="trans-card__verified" title="State Verified Depot">
                      <span className="material-symbols-outlined" style={{ fontSize: 19 }}>
                        verified
                      </span>
                    </span>

                    {showOpenRequestBadge && (
                      <button
                        className="trans-open-request-badge"
                        type="button"
                        onClick={() => openBankRequest(linkedRequest.id)}
                      >
                        <span className="trans-open-request-badge__dot">
                          <span className="trans-open-request-badge__ping" />
                          <span className="trans-open-request-badge__core" />
                        </span>
                        <span className="trans-open-request-badge__label">Open request here</span>
                        <span className="trans-open-request-badge__sep">|</span>
                        <span className="trans-open-request-badge__note">{linkedRequest.note}</span>
                      </button>
                    )}
                  </div>

                  <div className="trans-card__meta">
                    <span className="trans-card__meta-item">
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#94a3b8' }}>
                        near_me
                      </span>
                      {bank.distanceKm} km away
                    </span>
                    <span>·</span>
                    <span>{bank.area}</span>
                    <span>·</span>
                    <span className="trans-card__updated">Updated {bank.updatedMinAgo}m ago</span>
                  </div>
                </div>

                <div className="trans-stock-grid">
                  {STOCK_COLUMNS.map((col) => {
                    const pct = bank.stock[col];
                    const risk = riskForPct(pct);
                    const meta = riskMeta(risk);
                    return (
                      <div className="trans-stock-cell" key={col}>
                        <div className="trans-stock-cell__top">
                          <span className="trans-stock-cell__group">{col}</span>
                          <span className={`trans-stock-cell__tag trans-stock-cell__tag--${meta.className}`}>
                            {meta.label}
                          </span>
                        </div>
                        <div className="trans-stock-cell__bar">
                          <div
                            className={`trans-stock-cell__bar-fill trans-stock-cell__bar-fill--${meta.className}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="trans-stock-cell__bottom">
                          <span className="trans-stock-cell__pct">{pct}%</span>
                          <span className={`trans-stock-cell__label trans-stock-cell__label--${meta.className}`}>
                            {meta.sub}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="trans-card__footer">
                  <div className="trans-card__footer-left">
                    <span>
                      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#059669' }}>
                        ac_unit
                      </span>
                      Cold Chain Compliant
                    </span>
                    <span>
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                        emergency
                      </span>
                      Blood Bank Helpline: +91 22 4269 6969
                    </span>
                  </div>
                  <div className="trans-card__footer-right">
                    <button
                      className="trans-btn trans-btn--ghost"
                      type="button"
                      onClick={() => showToast(`Transit route map opened for ${bank.name}`)}
                    >
                      Transit Route Map
                    </button>
                    <button
                      className="trans-btn trans-btn--dark"
                      type="button"
                      onClick={() => showToast(`Connecting you to ${bank.name} dispatch desk…`)}
                    >
                      Contact Dispatch Desk
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </main>

        <section className="trans-trust">
          <div className="trans-trust__top">
            <div className="trans-trust__left">
              <div className="trans-trust__icon">
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
                  verified_user
                </span>
              </div>
              <div>
                <h3 className="trans-trust__title">
                  National Blood Transfusion Council (NBTC) &amp; e-RaktKosh Telemetry Synced
                </h3>
                <p className="trans-trust__desc">
                  Real-time inventory feeds authenticated every 300 seconds. Emergency SOS requests automatically
                  reserve verified units across the network.
                </p>
              </div>
            </div>
            <a
              className="trans-trust__link"
              onClick={(e) => {
                e.preventDefault();
                showToast('Regulatory ledger verified — SHA-256 audit trail intact');
              }}
            >
              <span>Verify Regulatory Ledger</span>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                open_in_new
              </span>
            </a>
          </div>
          <div className="trans-trust__bottom">
            <div>CONNECTED DEPOTS: {bloodBanks.length} · VERIFIED COLD-CHAIN: 100% · SHA-256 REGISTRY AUDIT</div>
            <div className="trans-trust__bottom-right">
              <span>PUBLIC DISCLOSURE PROTOCOL ACT §4</span>
              <span>·</span>
              <span>MUMBAI METRO REGION: MH-02</span>
            </div>
          </div>
        </section>
      </div>
    </OpsShell>
  );
}
