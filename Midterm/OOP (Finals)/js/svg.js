
    const colorWheel = document.getElementById('colorWheel');
    const colorValue = document.getElementById('colorValue');
    const ringTint = document.getElementById('ringTint');
    const ringPath = document.getElementById('ringPath');

    function setRingColor(hex) {
      colorValue.textContent = hex.toUpperCase();
      ringTint.setAttribute('fill', hex);
      const stroked = shade(hex, -25);
      ringPath.setAttribute('stroke', stroked);
    }

    function shade(hex, percent) {
      const c = parseInt(hex.substring(1), 16);
      const r = Math.min(255, Math.max(0, ((c >> 16) & 255) + Math.round(255 * percent / 100)));
      const g = Math.min(255, Math.max(0, ((c >> 8) & 255) + Math.round(255 * percent / 100)));
      const b = Math.min(255, Math.max(0, (c & 255) + Math.round(255 * percent / 100)));
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    colorWheel.addEventListener('input', (e) => setRingColor(e.target.value));
    setRingColor(colorWheel.value);
  