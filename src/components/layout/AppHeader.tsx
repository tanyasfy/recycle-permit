import { Link, NavLink, useNavigate } from "react-router-dom";
import "./AppHeader.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout } from "../../store/authSlice";
import type { Dispatch } from "react";
import { Button } from "../ui/Button";

interface AppHeaderProps {
  setOpenAuthModal: Dispatch<React.SetStateAction<boolean>>;
}

export function AppHeader({ setOpenAuthModal }: AppHeaderProps) {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      dispatch(logout());
      navigate("/");
    }
  };

  return (
    <header className="appHeader">
      <div className="headerContainer">
        <Link to="/" className="brand">
          <div className="brandLogo">EAR</div>

          <div>
            <p className="brandTitle">EAR Zulassungsportal</p>
            <span className="brandSubtitle">Digitale Antragstellung</span>
          </div>
        </Link>

        {user && (
          <nav className="navigation">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Startseite
            </NavLink>

            <NavLink
              to="/permits"
              className={({ isActive }) =>
                isActive ? "navLink active" : "navLink"
              }
            >
              Meine Anträge
            </NavLink>
          </nav>
        )}

        <div className="headerActions">
          <Button
            style="secondaryButton"
            title="Hilfe"
            onClick={() =>
              window.open(
                "https://www.stiftung-ear.de",
                "_blank",
                "noopener,noreferrer",
              )
            }
          />
          <Button
            style="primaryButton"
            title={user ? "Ausloggen" : "Einloggen"}
            onClick={handleClick}
          />
        </div>
      </div>
    </header>
  );
}
