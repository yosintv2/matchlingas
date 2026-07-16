import { useState } from 'react';

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`match-switch-btn ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function EventInfo({ match }) {
  const fd = match?.football_data || match?.cricket_data;
  const ev = fd?.event;
  if (!ev) {
    return <p className="text-sm text-gray-500">Event details not available for this match yet.</p>;
  }

  return (
    <div className="space-y-3">
      {ev.league && (
        <p className="text-sm"><strong>League:</strong> {ev.league}</p>
      )}
      {ev.round && (
        <p className="text-sm"><strong>Round:</strong> {ev.round}</p>
      )}
      {ev.kick_off_time_utc && (
        <p className="text-sm"><strong>Kick-off (UTC):</strong> {ev.kick_off_time_utc}</p>
      )}
      {ev.venue && (
        <p className="text-sm"><strong>Venue:</strong> {ev.venue}</p>
      )}
      {ev.stadium_capacity && (
        <p className="text-sm"><strong>Capacity:</strong> {ev.stadium_capacity?.toLocaleString()}</p>
      )}
      {ev.referee && (
        <p className="text-sm"><strong>Referee:</strong> {ev.referee}</p>
      )}
      {ev.home_team && (
        <p className="text-sm">
          <strong>Home:</strong> {typeof ev.home_team === 'object' ? ev.home_team.name : ev.home_team}
          {ev.home_manager ? ` (Manager: ${ev.home_manager})` : ''}
        </p>
      )}
      {ev.away_team && (
        <p className="text-sm">
          <strong>Away:</strong> {typeof ev.away_team === 'object' ? ev.away_team.name : ev.away_team}
          {ev.away_manager ? ` (Manager: ${ev.away_manager})` : ''}
        </p>
      )}
    </div>
  );
}

function HeadToHead({ match }) {
  const fd = match?.football_data || match?.cricket_data;
  const h2h = fd?.h2h;
  if (!h2h) {
    return <p className="text-sm text-gray-500">Head to head data not available.</p>;
  }

  const entries = Object.entries(h2h).filter(([k, v]) => v !== null && v !== undefined);
  if (entries.length === 0) {
    return <p className="text-sm text-gray-500">Head to head data not available.</p>;
  }

  return (
    <div className="overflow-x-auto no-scrollbar pb-1">
      <div className="inline-flex gap-2 min-w-full">
        {entries.map(([key, val]) => (
          <div key={key} className="flex-1 min-w-[100px] bg-gray-50 rounded-lg p-3 border border-gray-200 text-center">
            <p className="text-xs uppercase font-bold text-gray-500 mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="text-lg font-black text-gray-800">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Lineups({ match }) {
  const fd = match?.football_data || match?.cricket_data;
  const lineups = fd?.lineups;
  if (!lineups) {
    return <p className="text-sm text-gray-500">Lineup data not available for this match yet.</p>;
  }

  const homeFormation = lineups.home_formation;
  const awayFormation = lineups.away_formation;
  const homePlayers = lineups.home_players || [];
  const awayPlayers = lineups.away_players || [];
  const homeMissing = lineups.home_missing_players || [];
  const awayMissing = lineups.away_missing_players || [];

  return (
    <div className="space-y-4">
      {homeFormation && (
        <p className="text-sm"><strong>Home Formation:</strong> {homeFormation}</p>
      )}
      {awayFormation && (
        <p className="text-sm"><strong>Away Formation:</strong> {awayFormation}</p>
      )}
      {homePlayers.length > 0 && (
        <div>
          <h5 className="text-sm font-bold mb-1">Home Players</h5>
          <p className="text-xs text-gray-500">{homePlayers.join(', ')}</p>
        </div>
      )}
      {awayPlayers.length > 0 && (
        <div>
          <h5 className="text-sm font-bold mb-1">Away Players</h5>
          <p className="text-xs text-gray-500">{awayPlayers.join(', ')}</p>
        </div>
      )}
      {homeMissing.length > 0 && (
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-600"><strong>Home Missing:</strong> {homeMissing.join(', ')}</p>
        </div>
      )}
      {awayMissing.length > 0 && (
        <div className="bg-red-50 rounded-lg p-3 border border-red-200">
          <p className="text-xs text-red-600"><strong>Away Missing:</strong> {awayMissing.join(', ')}</p>
        </div>
      )}
      {homePlayers.length === 0 && awayPlayers.length === 0 && !homeFormation && !awayFormation && (
        <p className="text-sm text-gray-500">
          Predicted lineups are available a few days in advance. Actual lineup will be available about an hour before the match.
        </p>
      )}
    </div>
  );
}

function PregameForm({ match }) {
  const fd = match?.football_data || match?.cricket_data;
  const pf = fd?.pregame_form;
  if (!pf) {
    return <p className="text-sm text-gray-500">Pregame form data is not available for this match yet.</p>;
  }

  if (pf.error) {
    return (
      <p className="text-sm text-red-500">
        Pregame form data unavailable (error {pf.error.code}: {pf.error.reason || pf.error.message || 'unknown'})
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {Object.entries(pf).map(([key, val]) => (
        <p key={key} className="text-sm">
          <strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {typeof val === 'object' ? JSON.stringify(val) : String(val)}
        </p>
      ))}
    </div>
  );
}

const TABS = [
  { key: 'event-info', label: 'Event Info', Component: EventInfo },
  { key: 'h2h', label: 'Head to Head', Component: HeadToHead },
  { key: 'lineups', label: 'Lineups', Component: Lineups },
  { key: 'pregame', label: 'Pregame Form', Component: PregameForm },
];

export default function MatchInfo({ match }) {
  const [activeTab, setActiveTab] = useState('event-info');
  const currentTab = TABS.find(t => t.key === activeTab) || TABS[0];

  return (
    <div className="space-y-4 min-w-full overflow-visible">
      <h4 className="text-lg font-bold text-gray-900">Match Insights</h4>
      <p className="text-xs sm:text-sm text-gray-500">
        Switch between Event Info, Head to Head, Lineups and Pregame Form.
      </p>
      <div className="inline-flex min-w-max items-center gap-2 rounded-xl bg-slate-100 p-1 overflow-x-auto no-scrollbar w-full">
        {TABS.map(tab => (
          <TabButton
            key={tab.key}
            label={tab.label}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        {currentTab && <currentTab.Component match={match} />}
      </div>
    </div>
  );
}
