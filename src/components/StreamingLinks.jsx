export default function StreamingLinks({ data, loaded, match }) {
  if (!loaded) {
    return (
      <p className="text-center text-orange-600 font-semibold">
        Stream links loading soon...
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-center text-orange-600 font-semibold">
        Match Link Updating Soon
      </p>
    );
  }

  const events = Array.isArray(data.events) ? data.events : [];
  const items = events.flatMap(e => {
    if (!e || !e.name) return [];
    if (e.link) return [{ name: e.name, link: e.link }];
    if (Array.isArray(e.links)) return e.links.map(link => ({ name: e.name, link }));
    return [];
  });

  if (items.length === 0) {
    return (
      <p className="text-center text-orange-600 font-semibold">
        Match Link Updating Soon
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center text-decoration-none no-underline text-inherit my-1 p-3 border-2 border-solid border-black rounded-md cursor-pointer transition-shadow duration-300 bg-[#2e7d32] text-white font-bold hover:shadow-lg"
        >
          <span className="flex-2 text-center text-white font-bold">{item.name}</span>
        </a>
      ))}
    </div>
  );
}
