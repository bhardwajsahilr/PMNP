import React from 'react';
const KEYS = {
  USER: 'pmnp_user',
  BARANGAY: 'pmnp_barangay',
  MEETINGS: 'pmnp_meetings',
  LNAP: 'pmnp_lnap',
  LNC: 'pmnp_lnc',
  GIF: 'pmnp_gif',
  PFF: 'pmnp_pff',
  ADMIN_DOCS: 'pmnp_admin_docs',
  PROC_ANTHRO: 'pmnp_proc_anthro',
  PROC_EQUIP_SUPPLY: 'pmnp_proc_equip_supply',
  PROC_ICT_EQUIP: 'pmnp_proc_ict_equip',
  PROC_NUTRITION: 'pmnp_proc_nutrition',
  PROC_PHC_EQUIP: 'pmnp_proc_phc_equip',
  SBC_TARGETS: 'pmnp_sbc_targets'
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