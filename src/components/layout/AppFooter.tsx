import { Link } from "react-router-dom";
import "./AppFooter.css";

export function AppFooter() {
  return (
    <footer className="appFooter">
      <div className="footerContainer">
        <div className="footerBrand">
          <h3>EAR Zulassungsportal</h3>
          <p>Digitale Antragstellung für Recyclinganlagen.</p>
        </div>

        <nav className="footerNavigation">
          <Link to="/datenschutz">Datenschutz</Link>

          <Link to="/impressum">Impressum</Link>

          <Link to="/kontakt">Kontakt</Link>
        </nav>
      </div>
    </footer>
  );
}
