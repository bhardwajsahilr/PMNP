import React from 'react';
const KEYS = {
  USER: 'pmnp_user',
  BARANGAY: 'pmnp_barangay',
  MEETINGS: 'pmnp_meetings',
  LNAP: 'pmnp_lnap',
  LNC: 'pmnp_lnc',
  GIF: 'pmnp_gif',
  PFF: 'pmnp_pff'
} as const;
export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
export function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {

    // storage full or unavailable
  }}
export function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {

    // ignore
  }}
export { KEYS };