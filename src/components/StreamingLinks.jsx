import { useState } from 'react';

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
  const apiStyles = data.styles || {};

  const items = [];
  for (const e of events) {
    if (!e || !e.name) continue;
    if (e.link) {
      items.push({ name: e.name, link: e.link });
    } else if (Array.isArray(e.links)) {
      let idx = 0;
      for (const link of e.links) {
        if (!link) continue;
        idx++;
        items.push({ name: `${e.name} - Link ${idx}`, link });
      }
    }
  }

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
        <LinkButton key={i} item={item} apiStyles={apiStyles} />
      ))}
    </div>
  );
}

function LinkButton({ item, apiStyles }) {
  const [hovered, setHovered] = useState(false);
  const linkStyle = hovered && apiStyles.liveeHover
    ? `${apiStyles.livee}; ${apiStyles.liveeHover}`
    : apiStyles.livee || '';

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ...parseInlineStyle(linkStyle) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ ...parseInlineStyle(apiStyles.liveeName || '') }}>
        {item.name}
      </span>
    </a>
  );
}

function parseInlineStyle(cssString) {
  if (!cssString) return {};
  const style = {};
  cssString.split(';').forEach(rule => {
    const trimmed = rule.trim();
    if (!trimmed) return;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) return;
    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    if (key && value) {
      const camelKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      style[camelKey] = value;
    }
  });
  return style;
}
