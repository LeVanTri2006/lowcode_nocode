import { useCallback, useEffect, useState } from 'react';
export function useApiResource<T>(loader: (signal: AbortSignal) => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => { const controller = new AbortController(); setLoading(true); setError(null); loader(controller.signal).then(setData).catch((reason: unknown) => { if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu.'); }).finally(() => { if (!controller.signal.aborted) setLoading(false); }); return () => controller.abort(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, revision]);
  return { data, setData, loading, error, refresh };
}
