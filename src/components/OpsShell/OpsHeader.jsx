import { useLocation, useNavigate } from 'react-router-dom';
import { useRequests } from '../../context/RequestsContext.jsx';

export default function OpsHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRequestId } = useRequests();

  const links = [
    { path: 'dashboard', label: 'Dashboard', href: '/dashboard' },
    { path: 'alerts', label: 'Alerts', href: `/alerts/${activeRequestId}`, ping: true },
    { path: 'donors', label: 'Donors', href: `/donors/${activeRequestId}` },
    { path: 'transparency', label: 'Transparency', href: '/transparency' },
  ];

  function isActive(path) {
    return location.pathname.startsWith(`/${path}`);
  }

  return (
    <header className="ops-header">
      <div className="ops-header__inner">
        <div className="ops-brand" onClick={() => navigate('/')}>
          <div className="ops-brand__mark">
            <span className="material-symbols-outlined" style={{ color: 'var(--secondary)', fontSize: 18 }}>
              water_drop
            </span>
          </div>
          <span className="ops-brand__name">BloodLink</span>
          <span className="ops-brand__badge">OPS-CONSOLE</span>
        </div>

        <nav className="ops-nav">
          {links.map((link) => (
            <a
              key={link.path}
              className={`ops-nav__link ${isActive(link.path) ? 'ops-nav__link--active' : ''}`}
              onClick={() => navigate(link.href)}
            >
              <span>{link.label}</span>
              {link.ping && <span className="ops-nav__ping" />}
            </a>
          ))}
        </nav>

        <div className="ops-header__right">
          <div className="ops-live-pill">
            <span className="ops-live-pill__dot" />
            <span className="ops-live-pill__text">Live | 140ms</span>
          </div>
          <div className="ops-station-pill">
            <span>Andheri West Node DISPATCH #882</span>
          </div>
          <div className="ops-header__profile">
            <div className="ops-badge-sk">SK</div>
            <div className="ops-avatar">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                person
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
