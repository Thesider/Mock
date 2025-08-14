import React from 'react';
import './Header.css';

interface HeaderProps {
  userName: string;
  userEmail: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userEmail }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {/* This can be used for breadcrumbs or page title if needed */}
        </div>
        
        <div className="header-right">
          <div className="notification-icon">
            🔔
          </div>
          
          <div className="user-info">
            <div className="user-details">
              <div className="user-name">{userName}</div>
              <div className="user-email">{userEmail}</div>
            </div>
            <div className="user-avatar">
              <span>{userName.charAt(0)}</span>
            </div>
            <div className="verify-badge">
              ✓
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
