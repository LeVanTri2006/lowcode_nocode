import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  Database,
  Cpu,
  BarChart3,
  Bell,
  TrendingUp,
  Lightbulb,
  Compass,
  FileText,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      path: '/',
      icon: Home,
    },
    {
      id: 'wf01',
      label: 'WF01 - Đối thủ & Thu thập',
      path: '/wf01',
      icon: Users,
    },
    {
      id: 'wf02',
      label: 'WF02 - Làm sạch dữ liệu',
      path: '/wf02',
      icon: Database,
    },
    {
      id: 'wf03',
      label: 'WF03 - Phân tích AI',
      path: '/wf03',
      icon: Cpu,
    },
    {
      id: 'wf04',
      label: 'WF04 - Hiệu suất đối thủ',
      path: '/wf04',
      icon: BarChart3,
    },
    {
      id: 'wf05',
      label: 'WF05 - Giám sát & Cảnh báo',
      path: '/wf05',
      icon: Bell,
    },
    {
      id: 'wf06',
      label: 'WF06 - Xu hướng thị trường',
      path: '/wf06',
      icon: TrendingUp,
    },
    {
      id: 'wf07',
      label: 'WF07 - Cơ hội nội dung',
      path: '/wf07',
      icon: Lightbulb,
    },
    {
      id: 'wf08',
      label: 'WF08 - Dự báo hiệu suất',
      path: '/wf08',
      icon: Compass,
    },
    {
      id: 'wf09',
      label: 'WF09 - Báo cáo tự động',
      path: '/wf09',
      icon: FileText,
    },
    {
      id: 'wf10',
      label: 'WF10 - Bảng điều khiển tổng hợp',
      path: '/wf10',
      icon: Layers,
    },
  ];

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <Sparkles size={20} className="sparkle-icon" />
          </div>
          <div className="brand-title-wrap">
            <span className="brand-title">AI Competitive Analysis</span>
            <span className="brand-subtitle">YouTube Intelligence</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">QUẢN LÝ & WORKFLOW</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id} className="nav-item">
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onClose();
                      }
                    }}
                  >
                    <span className="nav-icon-wrap">
                      <IconComponent size={18} />
                    </span>
                    <span className="nav-label">{item.label}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="system-status-indicator">
            <span className="status-dot online" />
            <div className="status-info">
              <span className="status-title">Hệ thống sẵn sàng</span>
              <span className="status-desc">UI Mock Mode (v1.0)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
