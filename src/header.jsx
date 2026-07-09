import { Text, Divider } from '@legion-ui-kit/react-core';
import logo from './assets/logo2.png';
import './Header.css';

export const Header = ({
  onCollapseToggle,
  onSettingsClick,
  onProfileClick,
  breadcrumbLabel = 'Dashboard',
}) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Telkom CMMI" className="header-logo" />

        <div className="header-titles">
          <Text as="h1" variant="title">CMMI Dashboard</Text>
          <Text as="p" variant="subtitle" color="muted">
            Measuring Project Process Maturity
          </Text>
        </div>

        <button className="header-collapse-btn" onClick={onCollapseToggle}>
          ‹
        </button>
      </div>

      <div className="header-center">
        <Text as="span" className="breadcrumb-muted">CMMI Workspace /</Text>
        <Text as="span" className="breadcrumb-active">{breadcrumbLabel}</Text>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input className="search-input" placeholder="Search....." />
        </div>
      </div>

      <div className="header-right">
        <button className="bell-btn">🔔</button>

        <Divider orientation="vertical" />

        <button className="header-icon-btn" onClick={onSettingsClick}>
          ⚙️
        </button>

        <button className="header-icon-btn" onClick={onProfileClick}>
          👤
        </button>
      </div>
    </header>
  );
};

export default Header;