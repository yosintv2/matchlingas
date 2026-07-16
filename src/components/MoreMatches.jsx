import cfg from '../../config';
const placeholder = (text) =>
  `${cfg.placeholders.teamLogo}${encodeURIComponent(text)}&font=${cfg.placeholders.font}`;

function formatStart(start) {
  if (!start) return '';
  const d = new Date(start);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MoreMatches({ matches, currentSlug }) {
  const filtered = matches.filter(m => {
    const slug = m.details_url?.split(cfg.queryParam + '=')[1]?.toLowerCase();
    return slug !== currentSlug?.toLowerCase();
  });

  if (filtered.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4 text-sm">
        No additional matches available at this time.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
      <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        {filtered.map((m, i) => {
          const slug = m.details_url?.split('yosintv=')[1]?.toLowerCase() || '';
          const t1 = m.team1 || 'TBD';
          const t2 = m.team2 || 'TBD';
          const t1Logo = m.team1_logo || placeholder(t1.substring(0, 2).toUpperCase());
          const t2Logo = m.team2_logo || placeholder(t2.substring(0, 2).toUpperCase());

          return (
            <a
              key={i}
              href={`/?${cfg.queryParam}=${slug}`}
              className="block w-72 flex-shrink-0 group"
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
                <div className="mb-3">
                  <span className="text-[10px] font-bold text-blue-600 uppercase truncate tracking-wide block text-center">
                    {m.league || ''}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <img
                      src={t1Logo}
                      alt={t1}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain mb-1"
                      onError={(e) => { e.target.src = placeholder(t1.substring(0, 2).toUpperCase()); }}
                    />
                    <span className="text-[12px] font-bold text-gray-800 text-center leading-tight truncate w-full">
                      {t1}
                    </span>
                  </div>

                  <div className="flex flex-col items-center px-1">
                    <span className="text-xs font-black text-red-500">VS</span>
                  </div>

                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <img
                      src={t2Logo}
                      alt={t2}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-contain mb-1"
                      onError={(e) => { e.target.src = placeholder(t2.substring(0, 2).toUpperCase()); }}
                    />
                    <span className="text-[12px] font-bold text-gray-800 text-center leading-tight truncate w-full">
                      {t2}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 text-center">
                  <span className="text-[11px] font-semibold text-gray-500">
                    {formatStart(m.start)}
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
