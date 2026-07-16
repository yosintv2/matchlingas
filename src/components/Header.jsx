import cfg from '../../config';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <a href={cfg.site.homepageUrl} title="YoSinTV">
            <img alt="YoSinTV" src={cfg.site.logo} className="h-16 w-auto" />
            <h1 className="sr-only">{cfg.site.title}</h1>
          </a>
        </div>
      </div>
    </header>
  );
}
