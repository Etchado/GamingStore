import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// ── Shared validators ────────────────────────────────────────────────
// Whitelist of real TLDs. Explicit list beats {2,6} because {2,6} lets
// through .comm, .commmm, .nett, etc. which are not real TLDs.
// 2-letter country codes are covered by [a-z]{2} at the end of the list.
export const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|mil|biz|info|name|mobi|app|dev|shop|site|tech|store|web|blog|live|pro|co|io|me|sa|ae|bh|kw|om|qa|jo|eg|uk|de|fr|ca|au|us|[a-z]{2})$/i

// Names: letters (Latin), spaces, hyphens, apostrophes only — no digits or symbols
export const NAME_RE = /^[a-zA-Z\s'\-]+$/

export function stripArabic(v) {
  return v.replace(/[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/g, '')
}

// Strip anything not valid in a person's name
export function stripName(v) {
  return v.replace(/[^a-zA-Z\s'\-]/g, '')
}

export function isValidEmail(email) {
  return EMAIL_RE.test(email)
}

export function isValidName(name) {
  return name.trim().length > 0 && NAME_RE.test(name.trim())
}
