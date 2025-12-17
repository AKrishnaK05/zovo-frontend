/**
 * maps.js
 * Placeholder helpers for integrating Azure Maps (or other)
 * TODO: swap this with real Azure Maps SDK integration
 */

export const initMap = (el, options = {}) => {
  // Placeholder: returns a simple DOM with background
  if (!el) return
  el.innerHTML = ''
  const area = document.createElement('div')
  area.style.width = '100%'
  area.style.height = '100%'
  area.style.display = 'flex'
  area.style.alignItems = 'center'
  area.style.justifyContent = 'center'
  area.style.color = '#9CA3AF'
  area.innerText = 'Map placeholder - integrate Azure Maps SDK here'
  el.appendChild(area)
  return {
    setMarker: (lat, lng) => { /* no-op */ },
    destroy: () => { el.innerHTML = '' }
  }
}
