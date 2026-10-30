import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Info,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  FileText,
  Video,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import { WORKFLOW_STEPS } from '../../types/workflow';
import './TopHeader.css';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../common/Toast';
import { getNotifications } from '../../services/api/notificationsApi';
import type { SystemNotification } from '../../types/api';

interface TopHeaderProps {
  onToggleSidebar: () => void;
}

const READ_STORAGE_KEY = 'aca_read_notification_ids';

const getStoredReadIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
};

const saveStoredReadIds = (ids: Set<string>) => {
  try {
    localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(ids)));
  } catch {}
};

const formatRelativeTimeVi = (isoString: string): string => {
  try {
    const now = new Date().getTime();
    const past = new Date(isoString).getTime();
    if (isNaN(past)) return 'Vừa xong';

    const diffSec = Math.max(0, Math.floor((now - past) / 1000));
    if (diffSec < 60) return 'Vừa xong';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} phút trước`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} giờ trước`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay < 30) return `${diffDay} ngày trước`;
    const diffMonth = Math.floor(diffDay / 30);
    return `${diffMonth} tháng trước`;
  } catch {
    return 'Vừa xong';
  }
};

const getNotificationMeta = (type: SystemNotification['type']) => {
  switch (type) {
    case 'alert':
      return { icon: AlertTriangle, color: '#EF4444', label: 'Cảnh báo' };
    case 'opportunity':
      return { icon: Sparkles, color: '#10B981', label: 'Cơ hội' };
    case 'risk':
      return { icon: ShieldAlert, color: '#F43F5E', label: 'Rủi ro' };
    case 'report':
      return { icon: FileText, color: '#6366F1', label: 'Báo cáo' };
    case 'trend':
      return { icon: TrendingUp, color: '#8B5CF6', label: 'Xu hướng' };
    case 'content':
      return { icon: Video, color: '#0284C7', label: 'Nội dung' };
    default:
      return { icon: Info, color: '#3B82F6', label: 'Thông báo' };
  }
};

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { showToast } = useToast();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => getStoredReadIds());
  const [loading, setLoading] = useState(false);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      setShowUserDropdown(false);
      navigate('/login', { state: { returnTo: location.pathname } });
    } catch {
      showToast('Không thể đăng xuất khỏi máy chủ. Vui lòng thử lại.', 'error');
    }
  };

  // Tải dữ liệu thông báo thật từ API
  const fetchNotificationsData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getNotifications();
      if (Array.isArray(res)) {
        setNotifications(res);
      }
    } catch (err) {
      console.error('Lỗi khi tải thông báo hệ thống:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsData();
    // Tự động kiểm tra thông báo mới mỗi 45 giây
    const interval = setInterval(fetchNotificationsData, 45000);
    return () => clearInterval(interval);
  }, [fetchNotificationsData]);

  // Đóng dropdown khi click ra ngoài
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

  // Xác định breadcrumb
  const currentStep = WORKFLOW_STEPS.find((s) => s.path === location.pathname);
  const pageTitle =
    location.pathname === '/'
      ? 'Tổng quan hệ thống'
      : currentStep
      ? currentStep.name
      : 'Bảng điều khiển';

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      fetchNotificationsData();
    }
    setShowNotifications(!showNotifications);
  };

  const handleMarkAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = new Set([...readIds, ...notifications.map((n) => n.id)]);
    setReadIds(updated);
    saveStoredReadIds(updated);
    showToast('Đã đánh dấu tất cả thông báo là đã đọc', 'success');
  };

  const handleNotificationClick = (notif: SystemNotification) => {
    const updated = new Set(readIds);
    updated.add(notif.id);
    setReadIds(updated);
    saveStoredReadIds(updated);
    setShowNotifications(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <header className="app-top-header">
      <div className="header-left">
        <button
          className="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Mở hoặc đóng điều hướng"
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
        {/* Chuông Thông báo thật */}
        <div className="header-action-wrap" ref={notificationRef}>
          <button
            className={`notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={handleToggleNotifications}
            aria-label="Thông báo"
            title="Thông báo hệ thống"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown fade-in">
              <div className="dropdown-header">
                <div>
                  <h4 className="dropdown-title">Thông báo hệ thống</h4>
                  <span className="dropdown-subtitle">
                    {unreadCount > 0
                      ? `${unreadCount} thông báo mới chưa đọc`
                      : 'Tất cả thông báo đã được xem'}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button className="mark-read-btn" onClick={handleMarkAllAsRead}>
                    <CheckCheck size={14} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
                    Đánh dấu đã xem
                  </button>
                )}
              </div>

              <div className="notification-list">
                {loading && notifications.length === 0 ? (
                  <div className="notification-loading">
                    <Loader2 size={20} className="spinning-icon" />
                    <span>Đang tải thông báo thực tế...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="notification-empty">
                    <Bell size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                    <p>Chưa có thông báo nào từ hệ thống</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isUnread = !readIds.has(notif.id);
                    const meta = getNotificationMeta(notif.type);
                    const Icon = meta.icon;

                    return (
                      <div
                        key={notif.id}
                        className={`notification-item ${isUnread ? 'unread' : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                        title="Nhấn để xem chi tiết"
                      >
                        <div
                          className="notif-icon-circle"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                          }}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="notif-content">
                          <div className="notif-header-row">
                            <p className="notif-title">{notif.title}</p>
                            {isUnread && <span className="notif-unread-dot" />}
                          </div>
                          <p className="notif-desc">{notif.desc}</p>
                          <span className="notif-time">
                            {formatRelativeTimeVi(notif.timestamp)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="dropdown-footer">
                <button
                  className="view-all-btn"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/wf09');
                  }}
                >
                  Xem Báo cáo Chiến lược (WF09)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        {user ? (
          <div className="user-profile-wrap" ref={userDropdownRef}>
            <button
              className="user-profile-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              aria-expanded={showUserDropdown}
            >
              <div className="user-avatar">
                <span>{user.username.slice(0, 1).toUpperCase()}</span>
              </div>
              <div className="user-info">
                <span className="user-name">{user.username}</span>
                <span className="user-role">
                  {user.role === 'operator' ? 'Người vận hành' : 'Người xem'}
                </span>
              </div>
              <ChevronDown
                size={16}
                className={`chevron-icon ${showUserDropdown ? 'rotated' : ''}`}
              />
            </button>

            {showUserDropdown && (
              <div className="user-dropdown-menu fade-in">
                <div className="user-dropdown-header">
                  <div className="dropdown-avatar">
                    {user.username.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="dropdown-user-details">
                    <div className="dropdown-user-name">{user.username}</div>
                    <div className="dropdown-user-email">
                      {user.role === 'operator'
                        ? 'Người vận hành WF01'
                        : 'Chỉ xem dữ liệu'}
                    </div>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            className="user-profile-btn"
            onClick={() =>
              navigate('/login', { state: { returnTo: location.pathname } })
            }
          >
            <User size={17} />
            <span className="user-name">Đăng nhập</span>
          </button>
        )}
      </div>
    </header>
  );
};
