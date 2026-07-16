import cfg from '../../config';
const placeholder = (text) =>
  `${cfg.placeholders.teamLogo}${encodeURIComponent(text)}&font=${cfg.placeholders.font}`;

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function formatDate(start) {
  if (!start) return '';
  const d = new Date(start);
  if (isNaN(d.getTime())) return 'TBD';
  const h = d.getHours(), m = d.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}, ${String(hh).padStart(2,'0')}:${String(m).padStart(2,'0')} ${ampm}`;
}

export default function MatchCard({ match }) {
  if (!match) return null;

  const t1 = match.team1 || 'N/A';
  const t2 = match.team2 || 'N/A';
  const t1Logo = match.team1_logo || placeholder(t1.substring(0, 2).toUpperCase());
  const t2Logo = match.team2_logo || placeholder(t2.substring(0, 2).toUpperCase());
  const league = match.league || '';
  const start = match.start;

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-3xl">
        <div className="bg-gray-50 rounded-xl shadow-md border border-gray-300 p-6 flex flex-col items-center">
          <div className="grid grid-cols-3 items-center gap-4 text-center w-full">
            <div className="flex flex-col items-center">
              <img
                src={t1Logo}
                alt={t1}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
                onError={(e) => { e.target.src = placeholder(t1.substring(0, 2).toUpperCase()); }}
              />
              <span className="mt-2 text-base md:text-lg font-bold text-gray-800">{t1}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl md:text-5xl font-black text-red-600">VS</div>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={t2Logo}
                alt={t2}
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
                onError={(e) => { e.target.src = placeholder(t2.substring(0, 2).toUpperCase()); }}
              />
              <span className="mt-2 text-base md:text-lg font-bold text-gray-800">{t2}</span>
            </div>
          </div>
          {league && (
            <div className="match-league-bar mt-4">
              <p>{league}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 mt-4" id="match-date-time">
        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className="text-sm font-semibold text-blue-600">Match Time:</span>
        <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm font-semibold text-blue-700">
          {formatDate(start)}
        </span>
      </div>
    </div>
  );
}
