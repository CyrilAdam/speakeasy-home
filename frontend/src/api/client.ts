import type { Bottle, CocktailListItem, CocktailWithIngredients } from '../types.ts';

const BASE = '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error: string }).error ?? res.statusText);
  }
  return res.json() as Promise<T>;
}

// ── Bottles ───────────────────────────────────────────────────────────────────

export const api = {
  bottles: {
    list:   ()                         => request<Bottle[]>('/bottles'),
    get:    (id: string)               => request<Bottle>(`/bottles/${id}`),
    create: (data: Omit<Bottle, 'pantry'> & { pantry?: boolean }) =>
      request<Bottle>('/bottles', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Omit<Bottle, 'id'>>) =>
      request<Bottle>(`/bottles/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/bottles/${id}`, { method: 'DELETE' }),
  },

  cocktails: {
    list:   ()         => request<CocktailListItem[]>('/cocktails'),
    get:    (id: string) => request<CocktailWithIngredients>(`/cocktails/${id}`),
    create: (data: Omit<CocktailWithIngredients, 'canMake' | 'missingCount'> & { ingredients: { id: string; amount: string }[] }) =>
      request<CocktailWithIngredients>('/cocktails', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<CocktailWithIngredients & { ingredients: { id: string; amount: string }[] }>) =>
      request<CocktailWithIngredients>(`/cocktails/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<void>(`/cocktails/${id}`, { method: 'DELETE' }),
  },
};
