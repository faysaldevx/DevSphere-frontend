import { getTokenFromClient } from "@/lib/getTokenFromClient";

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/$/, "");

export const EVENT_TYPES = ["Cleanup", "Plantation", "Donation", "Education", "Health Camp", "Other"];

export async function apiFetch(path, options = {}, auth = false) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getTokenFromClient();
    if (!token) throw new Error("Please log in again to continue.");
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  const body = await res.json().catch(() => null);

  if (!res.ok) {

    throw new Error(body?.msg || "Something went wrong. Please try again.");
  }

  return body;
}

export const formatDate = (d) =>
  new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export async function getAllEvents() {
  const events = await apiFetch("/events");
  return Array.isArray(events) ? events : [];
}

// Nearest date first
export function sortByDate(events) {
  return [...events].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
}

// Only events whose date has not passed yet, nearest date first
export function onlyUpcoming(events) {
  const now = new Date();
  const upcoming = events.filter((event) => new Date(event.eventDate) > now);
  return sortByDate(upcoming);
}

// true when this email is in the event's list of joined people
export function hasJoined(event, email) {
  const people = event.joinedUsers || [];
  return people.some((person) => person.email === email);
}