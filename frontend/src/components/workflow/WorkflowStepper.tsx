import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { WORKFLOW_STEPS } from '../../types/workflow';
import './WorkflowStepper.css';

interface WorkflowStepperProps {
  currentStepNumber?: number;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStepNumber,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeStep =
    WORKFLOW_STEPS.find((s) => s.path === location.pathname) ||
    WORKFLOW_STEPS.find((s) => s.stepNumber === currentStepNumber);

  const activeNum = activeStep ? activeStep.stepNumber : currentStepNumber;

  return (
    <div className="wf-stepper all-ten">
      <div className="wf-stepper-track">
        {WORKFLOW_STEPS.map((step) => {
          const isActive = activeNum !== undefined && step.stepNumber === activeNum;

          return (
            <button
              key={step.id}
              type="button"
              className={`wf-stepper-item ${isActive ? 'is-active' : ''}`}
              onClick={() => navigate(step.path)}
              title={step.name}
            >
              <div className="wf-stepper-circle">{step.stepNumber}</div>
              <div className="wf-stepper-label">
                <span className="wf-stepper-code">
                  {`WF${step.stepNumber < 10 ? '0' : ''}${step.stepNumber}`}
                </span>
                <span className="wf-stepper-title">
                  {step.shortName}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
