"use client";

const SESSION_KEY = "binkis_subscribe_prompt_v3";
export const SUBSCRIBE_EVENT = "binkis:subscribe-seen";

export function hasSeenSubscribe(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return Boolean(window.sessionStorage.getItem(SESSION_KEY));
  } catch {
    return false;
  }
}

export function markSubscribeSeen() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    window.dispatchEvent(new CustomEvent(SUBSCRIBE_EVENT));
  } catch {
    // ignore
  }
}
