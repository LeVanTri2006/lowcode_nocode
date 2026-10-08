import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { WORKFLOW_STEPS } from '../../types/workflow';
import './TopHeader.css';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine breadcrumb
  const currentStep = WORKFLOW_STEPS.find((s) => s.path === location.pathname);
  const pageTitle =
    location.pathname === '/'
      ? 'Tổng quan hệ thống'
      : currentStep
      ? currentStep.name
      : 'Bảng điều khiển';

  const mockNotifications = [
    {
      id: '1',
      title: 'Cảnh báo tăng trưởng mới',
      desc: 'Marques Brownlee vừa có video mới tăng trưởng views +350% trong 24h.',
      time: '10 phút trước',
      icon: AlertTriangle,
      color: '#EF4444',
      isUnread: true,
    },
    {
      id: '2',
      title: 'Thu thập hoàn tất',
      desc: 'WF01 đã thu thập thành công 50 video từ TED, Veritasium.',
      time: '1 giờ trước',
      icon: CheckCircle2,
      color: '#10B981',
      isUnread: true,
    },
    {
      id: '3',
      title: 'Mô hình AI hoàn tất phân tích',
      desc: 'Phân tích chủ đề & cảm xúc 15 video mới đã hoàn tất.',
      time: '3 giờ trước',
      icon: Info,
      color: '#3B82F6',
      isUnread: true,
    },
  ];

  return (
    <header className="app-top-header">
      <div className="header-left">
        <button
          className="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={22} />
        </button>

        <div className="breadcrumb-trail">
          <span className="breadcrumb-root">Hệ thống</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{pageTitle}</span>
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="header-action-wrap" ref={notificationRef}>
          <button
            className={`notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="notification-dropdown fade-in">
              <div className="dropdown-header">
                <div>
                  <h4 className="dropdown-title">Thông báo</h4>
                  <span className="dropdown-subtitle">3 thông báo mới chưa đọc</span>
                </div>
                <button className="mark-read-btn">Đánh dấu đã đọc</button>
              </div>

              <div className="notification-list">
                {mockNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.isUnread ? 'unread' : ''}`}
                    >
                      <div
                        className="notif-icon-circle"
                        style={{ backgroundColor: `${notif.color}15`, color: notif.color }}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="notif-content">
                        <p className="notif-title">{notif.title}</p>
                        <p className="notif-desc">{notif.desc}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="dropdown-footer">
                <button className="view-all-btn">Xem tất cả thông báo</button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="user-profile-wrap" ref={userDropdownRef}>
          <button
            className="user-profile-btn"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            aria-expanded={showUserDropdown}
          >
            <div className="user-avatar">
              <span>T</span>
            </div>
            <div className="user-info">
              <span className="user-name">Trí Lê Văn</span>
              <span className="user-role">Administrator</span>
            </div>
            <ChevronDown size={16} className={`chevron-icon ${showUserDropdown ? 'rotated' : ''}`} />
          </button>

          {showUserDropdown && (
            <div className="user-dropdown-menu fade-in">
              <div className="user-dropdown-header">
                <div className="dropdown-avatar">T</div>
                <div className="dropdown-user-details">
                  <div className="dropdown-user-name">Trí Lê Văn</div>
                  <div className="dropdown-user-email">vantri@example.com</div>
                </div>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item">
                <User size={16} />
                <span>Hồ sơ cá nhân</span>
              </button>
              <button className="dropdown-item">
                <Settings size={16} />
                <span>Cài đặt hệ thống</span>
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item logout">
                <LogOut size={16} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
