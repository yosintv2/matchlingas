import cfg from '../../config';

async function safeJson(res) {
  try {
    const text = await res.text();
    if (!text || text.trim().length === 0) return null;
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function fetchAllMatches() {
  const [footballRes, cricketRes, moreRes] = await Promise.allSettled([
    fetch(cfg.api.football + '?t=' + Date.now()),
    fetch(cfg.api.cricket + '?t=' + Date.now()),
    fetch(cfg.api.more + '?t=' + Date.now()),
  ]);

  const all = [];

  if (footballRes.status === 'fulfilled' && footballRes.value.ok) {
    const data = await safeJson(footballRes.value);
    if (data?.matches) all.push(...data.matches.map(m => ({ ...m, _sport: 'football' })));
  }
  if (cricketRes.status === 'fulfilled' && cricketRes.value.ok) {
    const data = await safeJson(cricketRes.value);
    if (data?.matches) all.push(...data.matches.map(m => ({ ...m, _sport: 'cricket' })));
  }
  if (moreRes.status === 'fulfilled' && moreRes.value.ok) {
    const data = await safeJson(moreRes.value);
    if (data?.matches) all.push(...data.matches.map(m => ({ ...m, _sport: 'more' })));
  }

  return all;
}

export async function fetchStreamingLinks(url) {
  const cacheBust = url.includes('?') ? '&t=' : '?t=';
  try {
    const res = await fetch(url + cacheBust + Date.now());
    if (!res.ok) return null;
    return await safeJson(res);
  } catch {
    return null;
  }
}
