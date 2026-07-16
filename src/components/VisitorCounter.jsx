import { useEffect } from 'react';

export default function VisitorCounter() {
  useEffect(() => {
    const existing = document.getElementById('wauf8n-script');
    if (existing) return;

    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;overflow:hidden;visibility:hidden;z-index:9999;';

    const s1 = document.createElement('script');
    s1.type = 'text/javascript';
    s1.src = '//widget.supercounters.com/ssl/online_i.js';
    container.appendChild(s1);

    const s2 = document.createElement('script');
    s2.type = 'text/javascript';
    s2.textContent = 'sc_online_i(1714446,"ffffff","ffffff");';
    container.appendChild(s2);

    const noscript = document.createElement('noscript');
    const lnk = document.createElement('a');
    lnk.href = 'https://www.supercounters.com/';
    lnk.style.visibility = 'hidden';
    lnk.textContent = 'free online counter';
    noscript.appendChild(lnk);
    container.appendChild(noscript);

    const s3 = document.createElement('script');
    s3.id = 'wauf8n-script';
    s3.textContent = `var _wau = _wau || []; _wau.push(["dynamic", "1qzxz258so", "f8n", "c4302bffffff", "small"]);`;
    container.appendChild(s3);

    const s4 = document.createElement('script');
    s4.async = true;
    s4.src = '//waust.at/d.js';
    container.appendChild(s4);

    document.body.appendChild(container);
  }, []);

  return null;
}
