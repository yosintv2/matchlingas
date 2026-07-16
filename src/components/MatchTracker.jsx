import { useState, useEffect } from 'react';

export default function MatchTracker({ match }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('scheduled');

  useEffect(() => {
    function calc() {
      if (!match?.start || !match?.duration) {
        setStatus('unknown');
        setProgress(0);
        return;
      }

      const start = new Date(match.start).getTime();
      if (isNaN(start)) {
        setStatus('unknown');
        setProgress(0);
        return;
      }

      const durationMs = match.duration * 3600000;
      const now = Date.now();
      const elapsed = now - start;

      if (elapsed < 0) {
        setStatus('scheduled');
        setProgress(0);
      } else if (elapsed >= durationMs) {
        setStatus('ended');
        setProgress(100);
      } else {
        setStatus('live');
        setProgress(Math.min((elapsed / durationMs) * 100, 100));
      }
    }

    calc();
    const interval = setInterval(calc, 5000);
    return () => clearInterval(interval);
  }, [match?.start, match?.duration]);

  if (status === 'unknown') return null;

  const statusColors = {
    scheduled: 'bg-blue-500',
    live: 'bg-red-500',
    ended: 'bg-gray-400',
  };

  const statusLabels = {
    scheduled: 'Upcoming',
    live: 'LIVE',
    ended: 'Ended',
  };

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {status === 'live' && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className={`text-xs font-bold uppercase ${status === 'live' ? 'text-red-600' : status === 'scheduled' ? 'text-blue-600' : 'text-gray-500'}`}>
            {statusLabels[status]}
          </span>
        </div>
        {status === 'live' && (
          <span className="text-xs font-semibold text-gray-500">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${statusColors[status]} ${status === 'live' ? 'animate-pulse' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
