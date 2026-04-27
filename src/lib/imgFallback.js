export const IMG_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Crect x='155' y='90' width='90' height='60' rx='4' fill='none' stroke='%23d1d5db' stroke-width='3'/%3E%3Cline x1='180' y1='150' x2='172' y2='172' stroke='%23d1d5db' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='220' y1='150' x2='228' y2='172' stroke='%23d1d5db' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='168' y1='172' x2='232' y2='172' stroke='%23d1d5db' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E"

export function onImgError(e) {
  e.currentTarget.src = IMG_PLACEHOLDER
  e.currentTarget.onerror = null
}
