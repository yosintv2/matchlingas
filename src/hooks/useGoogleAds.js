import { useEffect, useRef } from 'react';
import cfg from '../../config';

function loadAdSenseScript() {
  if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.crossOrigin = 'anonymous';
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.ads.clientId}`;
  document.head.appendChild(script);
}

export function useGoogleAd(containerId, slotId, options = {}) {
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current) return;
    injected.current = true;

    loadAdSenseScript();

    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) return;
      if (container.querySelector('ins.adsbygoogle')) return;

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.cssText = 'display:block;';
      ins.setAttribute('data-ad-client', cfg.ads.clientId);
      ins.setAttribute('data-ad-slot', slotId);
      ins.setAttribute('data-ad-format', options.format || 'auto');
      if (options.responsive !== false) {
        ins.setAttribute('data-full-width-responsive', 'true');
      }
      container.appendChild(ins);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('[AdSense] push error:', e);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [containerId, slotId, options.format, options.responsive]);
}

export function useFixedBottomAd(slotId, width = cfg.ads.fixedBottomWidth, height = cfg.ads.fixedBottomHeight) {
  useEffect(() => {
    loadAdSenseScript();

    const timer = setTimeout(() => {
      const wrapperId = 'gam-fixed-ad';
      if (document.getElementById(wrapperId)) return;

      const wrapper = document.createElement('div');
      wrapper.id = wrapperId;
      wrapper.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: ${width}px;
        z-index: 9990;
        background: #fff;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
        border-radius: 8px 8px 0 0;
        overflow: hidden;
      `;

      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.setAttribute('aria-label', 'Close ad');
      closeBtn.style.cssText = `
        position: absolute;
        top: 4px;
        right: 6px;
        background: rgba(0,0,0,0.5);
        color: #fff;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        line-height: 1;
      `;
      closeBtn.addEventListener('click', () => wrapper.remove());
      wrapper.appendChild(closeBtn);

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.cssText = `display:inline-block;width:${width}px;height:${height}px;`;
      ins.setAttribute('data-ad-client', cfg.ads.clientId);
      ins.setAttribute('data-ad-slot', slotId);
      wrapper.appendChild(ins);

      document.body.appendChild(wrapper);

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.warn('[AdSense] fixed ad error:', e);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slotId]);
}
