import { useCallback, useEffect, useRef, useState } from 'react';
import { apiMessage } from '../api/errors';

type State<T> = { data?: T; loading: boolean; error?: string };

/**
 * Loads something from the server when the screen opens (and again whenever `deps` change).
 * `reload()` fetches again without blanking the screen.
 */
export function useApi<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<State<T>>({ loading: true });
  const loader = useRef(load);
  loader.current = load;
  const alive = useRef(true);
  const seq = useRef(0);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(async (quiet: boolean) => {
    const mine = ++seq.current;
    if (!quiet) setState((s) => ({ data: s.data, loading: true }));
    try {
      const data = await loader.current();
      if (alive.current && mine === seq.current) setState({ data, loading: false });
    } catch (error) {
      if (alive.current && mine === seq.current) setState((s) => ({ data: s.data, loading: false, error: apiMessage(error) }));
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void run(false), deps);

  return { ...state, reload: () => run(true), setData: (data: T) => setState({ data, loading: false }) };
}

/** Calls `fn` every `ms` while `active` is true. */
export function usePolling(fn: () => void, ms: number, active = true) {
  const latest = useRef(fn);
  latest.current = fn;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => latest.current(), ms);
    return () => clearInterval(id);
  }, [ms, active]);
}
