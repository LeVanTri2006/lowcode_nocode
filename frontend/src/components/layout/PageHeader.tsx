import React from 'react';
import { WorkflowStepper } from '../workflow/WorkflowStepper';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  stepNumber?: number;
  showStepper?: boolean;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  stepNumber,
  showStepper = true,
  actions,
}) => {
  return (
    <div className="page-header-container">
      <div className="page-header-main">
        <h1 className="page-header-title">{title}</h1>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
      </div>

      <div className="page-header-right">
        {showStepper && <WorkflowStepper currentStepNumber={stepNumber} />}
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  );
};
