import cfg from '../../config';
const placeholder = (text) =>
  `${cfg.placeholders.teamLogo}${encodeURIComponent(text)}&font=${cfg.placeholders.font}`;

function formatDate(start) {
  if (!start) return '';
  const d = new Date(start);
  if (isNaN(d.getTime())) return 'TBD';
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', ' at');
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
      <p className="text-sm sm:text-base font-semibold text-blue-600 mt-4" id="match-date-time">
        Match Time: {formatDate(start)}
      </p>
    </div>
  );
}
