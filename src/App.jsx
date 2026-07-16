import { useMemo, useEffect } from 'react';
import cfg from '../config';
import Header from './components/Header';
import Footer from './components/Footer';
import MatchCard from './components/MatchCard';
import StreamingLinks from './components/StreamingLinks';
import MoreMatches from './components/MoreMatches';
import MatchInfo from './components/MatchInfo';
import MatchTracker from './components/MatchTracker';
import SocialShare from './components/SocialShare';
import VisitorCounter from './components/VisitorCounter';
import { useMatchData } from './hooks/useMatchData';
import { useGoogleAd, useFixedBottomAd } from './hooks/useGoogleAds';

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || '';
}

function AdBanner({ id, slotId }) {
  useGoogleAd(id, slotId);
  return <div className="adspos" id={id} />;
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-pulse space-y-4 w-full max-w-md">
        <div className="h-48 bg-gray-200 rounded-xl" />
        <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function App() {
  const querySlug = useMemo(() => getQueryParam(cfg.queryParam), []);
  const { match, otherMatches, streamingData, streamingLoaded, error } = useMatchData(querySlug);

  useFixedBottomAd(cfg.ads.fixedBottomSlot);

  useEffect(() => {
    if (match) {
      document.title = `${match.team1} vs ${match.team2}, ${match.league}`;
    } else {
      document.title = cfg.site.title;
    }
  }, [match]);

  return (
    <div className="bg-gray-100 font-sans text-gray-900 min-h-screen">
      <Header />

      <div className="container mx-auto max-w-4xl px-4 py-4">
        <AdBanner id="ad-top-banner" slotId={cfg.ads.topBannerSlot} />
      </div>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Error loading data: {error}</p>
            <a href="/" className="text-blue-600 underline mt-2 inline-block">Go Home</a>
          </div>
        ) : match === undefined ? (
          <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <Spinner />
          </section>
        ) : match === null ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-yellow-700 font-semibold">
              No match found for "{querySlug || 'this link'}".
              {otherMatches.length > 0 ? ' Check out available matches below.' : ''}
            </p>
            <a href="/" className="text-blue-600 underline mt-2 inline-block">Go Home</a>
          </div>
        ) : (
          <>
            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <div className="space-y-4" id="cricket-matches">
                <MatchCard match={match} />
                <div className="flex items-center justify-center -mt-2 mb-3">
                  <SocialShare match={match} />
                </div>
                <p id="watch-live-copy">
                  ● Watch the live of {match.team1} vs {match.team2}, {match.league} in HD Quality, Scroll down to check out every link for smooth live stream of this match.
                </p>
                <p>
                  ● Predicted lineups are available for the match a few days in advance while the actual lineup will be available about an hour ahead of the match.
                </p>
                <div id="lineup-image-container" className="my-4" />
                <AdBanner id="ad-middle-banner" slotId={cfg.ads.middleBannerSlot} />
                <div id="live-tracker" />
                <p>
                  ● If the first link stops working, freezes, or won't open, try the second or third link to keep watching without trouble.
                </p>
                <a
                  href={cfg.site.downloadApkUrl}
                  download
                  className="block w-full my-3 py-3.5 bg-blue-700 text-white text-center font-bold rounded-xl no-underline tracking-wide"
                >
                  📲 YoSinTV APK — Download Now
                </a>
                <MatchTracker match={match} />
                <div id="live-container" className="space-y-4 my-8">
                  <StreamingLinks data={streamingData} loaded={streamingLoaded} match={match} />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">More Matches</h3>
              <MoreMatches matches={otherMatches} currentSlug={querySlug} />
            </section>

            <section className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <MatchInfo match={match} />
            </section>
          </>
        )}
      </main>

      <VisitorCounter />
      <Footer />
    </div>
  );
}
