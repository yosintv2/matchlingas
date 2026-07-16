import { useState, useEffect } from 'react';

function fmtDuration(ms) {
  if (ms < 0) ms = 0;
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MatchTracker({ match }) {
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [status, setStatus] = useState('scheduled');

  useEffect(() => {
    function calc() {
      if (!match?.start || !match?.duration) {
        setStatus('unknown');
        return;
      }

      const start = new Date(match.start).getTime();
      if (isNaN(start)) {
        setStatus('unknown');
        return;
      }

      const dur = match.duration * 3600000;
      setDurationMs(dur);

      const now = Date.now();
      const elapsed = now - start;

      if (elapsed < 0) {
        setStatus('scheduled');
        setProgress(0);
        setElapsedMs(0);
      } else if (elapsed >= dur) {
        setStatus('ended');
        setProgress(100);
        setElapsedMs(dur);
      } else {
        setStatus('live');
        setProgress(Math.min((elapsed / dur) * 100, 100));
        setElapsedMs(elapsed);
      }
    }

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [match?.start, match?.duration]);

  if (status === 'unknown') return null;

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {status === 'live' && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          <span className={`text-xs font-bold uppercase ${status === 'live' ? 'text-red-600' : status === 'scheduled' ? 'text-blue-600' : 'text-gray-500'}`}>
            {status === 'live' ? 'LIVE' : status === 'scheduled' ? 'Upcoming' : 'Ended'}
          </span>
        </div>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${status === 'live' ? 'bg-red-500 animate-pulse' : status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-400'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs font-semibold text-gray-600 mt-2 text-center">
        {status === 'live'
          ? `Match Playing Time: ${fmtDuration(elapsedMs)} / ${fmtDuration(durationMs)}`
          : status === 'scheduled'
            ? `Match starts in ${fmtDuration(-elapsedMs)}`
            : `Full Time: ${fmtDuration(durationMs)}`}
      </p>
    </div>
  );
}
