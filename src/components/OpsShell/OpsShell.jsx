import OpsHeader from './OpsHeader.jsx';
import OpsFooter from './OpsFooter.jsx';
import './OpsShell.css';

export default function OpsShell({ children, mainClassName = '' }) {
  return (
    <div className="ops-shell">
      <OpsHeader />
      <main className="ops-main">
        <div className={`ops-main__inner ${mainClassName}`}>{children}</div>
      </main>
      <OpsFooter />
    </div>
  );
}
