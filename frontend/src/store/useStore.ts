import { create } from 'zustand';
import { api } from '../api/client.ts';
import type { Bottle, CocktailListItem, CocktailWithIngredients } from '../types.ts';

interface AppState {
  // ── Data ──────────────────────────────────────────────────────────────────
  cocktails: CocktailListItem[];
  bottles:   Bottle[];
  loading:   boolean;
  error:     string | null;

  // ── UI — navigation ───────────────────────────────────────────────────────
  activeTab:        number;
  selectedCocktail: CocktailWithIngredients | null;
  search:           string;
  isManager:        boolean;
  showPin:          boolean;

  // ── UI — modals ───────────────────────────────────────────────────────────
  showAddCocktail:  boolean;
  editingCocktail:  CocktailWithIngredients | null;
  editingBottle:    Bottle | null;
  showCategories:   boolean;

  // ── Client-side state (resets each session) ───────────────────────────────
  favorites:    Set<string>;
  availability: Record<string, boolean>; // false = masqué ce soir

  // ── Actions — data ────────────────────────────────────────────────────────
  loadAll:        () => Promise<void>;
  toggleBottle:   (id: string) => Promise<void>;
  addBottle:      (data: Omit<Bottle, 'pantry'> & { pantry?: boolean }) => Promise<void>;
  updateBottle:   (id: string, data: Partial<Omit<Bottle, 'id'>>) => Promise<void>;
  deleteBottle:   (id: string) => Promise<void>;
  addCocktail:    (data: Parameters<typeof api.cocktails.create>[0]) => Promise<void>;
  updateCocktail: (id: string, data: Parameters<typeof api.cocktails.update>[1]) => Promise<void>;
  deleteCocktail: (id: string) => Promise<void>;

  // ── Actions — navigation ──────────────────────────────────────────────────
  selectCocktail:      (c: CocktailListItem) => Promise<void>;
  clearSelection:      () => void;
  setActiveTab:        (tab: number) => void;
  setSearch:           (s: string) => void;
  switchToManager:     () => void;
  switchToConsumer:    () => void;
  requestManagerMode:  () => void;

  // ── Actions — favorites / availability ───────────────────────────────────
  toggleFav:          (id: string) => void;
  toggleAvailability: (id: string) => void;

  // ── Actions — modals ──────────────────────────────────────────────────────
  openAddCocktail:   () => void;
  closeAddCocktail:  () => void;
  openEditCocktail:  (c: CocktailWithIngredients) => void;
  closeEditCocktail: () => void;
  openEditBottle:    (b: Bottle) => void;
  closeEditBottle:   () => void;
  openCategories:    () => void;
  closeCategories:   () => void;
  closePin:          () => void;
}

export const useStore = create<AppState>((set, get) => ({
  cocktails: [],
  bottles:   [],
  loading:   false,
  error:     null,

  activeTab:        0,
  selectedCocktail: null,
  search:           '',
  isManager:        true,
  showPin:          false,

  showAddCocktail:  false,
  editingCocktail:  null,
  editingBottle:    null,
  showCategories:   false,

  favorites:    new Set(),
  availability: {},

  // ── Data actions ──────────────────────────────────────────────────────────

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const [cocktails, bottles] = await Promise.all([api.cocktails.list(), api.bottles.list()]);
      set({ cocktails, bottles, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  toggleBottle: async (id) => {
    const bottle = get().bottles.find(b => b.id === id);
    if (!bottle || bottle.pantry) return;
    const owned = !bottle.owned;
    // Optimistic update
    set(s => ({ bottles: s.bottles.map(b => b.id === id ? { ...b, owned } : b) }));
    try {
      await api.bottles.update(id, { owned });
      // Refresh cocktails (canMake changes)
      const cocktails = await api.cocktails.list();
      set({ cocktails });
    } catch {
      // Rollback
      set(s => ({ bottles: s.bottles.map(b => b.id === id ? { ...b, owned: !owned } : b) }));
    }
  },

  addBottle: async (data) => {
    const bottle = await api.bottles.create(data);
    set(s => ({ bottles: [...s.bottles, bottle] }));
  },

  updateBottle: async (id, data) => {
    const bottle = await api.bottles.update(id, data);
    set(s => ({
      bottles: s.bottles.map(b => b.id === id ? bottle : b),
      editingBottle: null,
    }));
    const cocktails = await api.cocktails.list();
    set({ cocktails });
  },

  deleteBottle: async (id) => {
    await api.bottles.delete(id);
    set(s => ({
      bottles: s.bottles.filter(b => b.id !== id),
      editingBottle: null,
    }));
  },

  addCocktail: async (data) => {
    const cocktail = await api.cocktails.create(data);
    set(s => ({ cocktails: [...s.cocktails, cocktail], showAddCocktail: false }));
  },

  updateCocktail: async (id, data) => {
    const updated = await api.cocktails.update(id, data);
    set(s => ({
      cocktails: s.cocktails.map(c => c.id === id ? updated : c),
      selectedCocktail: s.selectedCocktail?.id === id ? updated : s.selectedCocktail,
      editingCocktail: null,
    }));
  },

  deleteCocktail: async (id) => {
    await api.cocktails.delete(id);
    set(s => ({
      cocktails:       s.cocktails.filter(c => c.id !== id),
      selectedCocktail: null,
      editingCocktail:  null,
    }));
  },

  // ── Navigation ─────────────────────────────────────────────────────────────

  selectCocktail: async (c) => {
    const detail = await api.cocktails.get(c.id);
    set({ selectedCocktail: detail });
  },

  clearSelection: () => set({ selectedCocktail: null }),

  setActiveTab: (tab) => set({ activeTab: tab, selectedCocktail: null, search: '' }),

  setSearch: (search) => set({ search }),

  switchToManager:    () => set({ isManager: true,  showPin: false, activeTab: 0, selectedCocktail: null }),
  switchToConsumer:   () => set({ isManager: false, activeTab: 0, selectedCocktail: null }),
  requestManagerMode: () => set({ showPin: true }),
  closePin:           () => set({ showPin: false }),

  // ── Favorites / availability ───────────────────────────────────────────────

  toggleFav: (id) => set(s => {
    const favs = new Set(s.favorites);
    favs.has(id) ? favs.delete(id) : favs.add(id);
    return { favorites: favs };
  }),

  toggleAvailability: (id) => set(s => ({
    availability: { ...s.availability, [id]: s.availability[id] === false ? true : false },
  })),

  // ── Modals ─────────────────────────────────────────────────────────────────

  openAddCocktail:   () => set({ showAddCocktail: true }),
  closeAddCocktail:  () => set({ showAddCocktail: false }),
  openEditCocktail:  (c) => set({ editingCocktail: c }),
  closeEditCocktail: () => set({ editingCocktail: null }),
  openEditBottle:    (b) => set({ editingBottle: b }),
  closeEditBottle:   () => set({ editingBottle: null }),
  openCategories:    () => set({ showCategories: true }),
  closeCategories:   () => set({ showCategories: false }),
}));
