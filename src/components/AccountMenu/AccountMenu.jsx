import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../Toast/Toast.jsx';
import './AccountMenu.css';

export default function AccountMenu({ trigger, name, role, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  function pick(action) {
    setOpen(false);
    if (action === 'profile') showToast(`${name} — profile view coming soon`);
    if (action === 'settings') showToast('Account settings — coming soon');
    if (action === 'logout') {
      showToast('Logged out');
      navigate('/');
    }
  }

  return (
    <div className="account-menu" ref={rootRef}>
      <button
        type="button"
        className="account-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {trigger}
      </button>

      {open && (
        <div className={`account-menu__panel account-menu__panel--${align}`}>
          <div className="account-menu__header">
            <div className="account-menu__name">{name}</div>
            {role && <div className="account-menu__role">{role}</div>}
          </div>
          <div className="account-menu__divider" />
          <button type="button" className="account-menu__item" onClick={() => pick('profile')}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
              account_circle
            </span>
            <span>View Profile</span>
          </button>
          <button type="button" className="account-menu__item" onClick={() => pick('settings')}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
              settings
            </span>
            <span>Settings</span>
          </button>
          <div className="account-menu__divider" />
          <button type="button" className="account-menu__item account-menu__item--danger" onClick={() => pick('logout')}>
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
              logout
            </span>
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
