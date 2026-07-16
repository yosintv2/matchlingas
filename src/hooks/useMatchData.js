import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllMatches, fetchStreamingLinks } from '../utils/api';
import cfg from '../../config';

function isMatchLive(start, duration) {
  if (!start || !duration) return false;
  const s = new Date(start).getTime();
  if (isNaN(s)) return false;
  const now = Date.now();
  return now >= s && now < s + duration * 3600000;
}

export function useMatchData(querySlug) {
  const [match, setMatch] = useState(undefined);
  const [otherMatches, setOtherMatches] = useState([]);
  const [streamingData, setStreamingData] = useState(null);
  const [streamingLoaded, setStreamingLoaded] = useState(false);
  const [error, setError] = useState(null);
  const streamingUrlRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const all = await fetchAllMatches();
        if (cancelled) return;

        const found = all.find(m => {
          const slug = m.details_url?.split(cfg.queryParam + '=')[1]?.toLowerCase();
          return slug === querySlug?.toLowerCase();
        });

        if (cancelled) return;
        setMatch(found || null);
        streamingUrlRef.current = found?.streaming_url || null;
        setOtherMatches(all.filter(m => m !== found));

        if (found?.streaming_url) {
          fetchStreamingLinks(found.streaming_url).then(stream => {
            if (!cancelled) { setStreamingData(stream); setStreamingLoaded(true); }
          });
        } else {
          setStreamingLoaded(true);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [querySlug]);

  useEffect(() => {
    if (!match?.start || !match?.duration) return;
    if (!isMatchLive(match.start, match.duration)) return;

    const interval = setInterval(() => {
      if (streamingUrlRef.current) {
        fetchStreamingLinks(streamingUrlRef.current).then(stream => {
          setStreamingData(stream); setStreamingLoaded(true);
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [match?.start, match?.duration]);

  const refreshStreaming = useCallback(() => {
    if (streamingUrlRef.current) {
      fetchStreamingLinks(streamingUrlRef.current).then(stream => {
        setStreamingData(stream);
      });
    }
  }, []);

  return { match, otherMatches, streamingData, streamingLoaded, error, refreshStreaming };
}
