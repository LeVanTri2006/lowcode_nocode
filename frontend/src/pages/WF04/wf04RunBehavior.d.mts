export type Wf04RunOutcome =
  | { status: 'no_work'; message: string }
  | { status: 'accepted'; message: string }
  | { status: 'error'; message: string; httpStatus?: number };

export function createInFlightLock(): {
  acquire: () => boolean;
  release: () => void;
};

export function getWf04RunErrorMessage(error: unknown): string;
export function executeWf04Run(request: () => Promise<{ status?: string }>): Promise<Wf04RunOutcome>;
export function getAnalysisTimestamp(analysis: { createdAt?: string | null; updatedAt?: string | null } | null | undefined): { value: string | null | undefined; label: string };
export function formatVietnameseDate(value: string | null | undefined): string;
