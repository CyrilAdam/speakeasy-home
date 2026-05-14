import { useEffect } from 'react';
import { useStore } from './store/useStore.ts';
import { PALETTES } from './types.ts';
import { BottomNav } from './components/BottomNav.tsx';
import { CatalogueScreen } from './screens/CatalogueScreen.tsx';
import { FaisablesScreen } from './screens/FaisablesScreen.tsx';
import { BarScreen } from './screens/BarScreen.tsx';
import { FavorisScreen } from './screens/FavorisScreen.tsx';
import { ConsumerCeSoirScreen } from './screens/ConsumerCeSoirScreen.tsx';
import { DetailScreen } from './screens/DetailScreen.tsx';
import { PinModal } from './modals/PinModal.tsx';
import { EditBottleModal } from './modals/EditBottleModal.tsx';
import { ManageCategoriesModal } from './modals/ManageCategoriesModal.tsx';
import { AddCocktailModal } from './modals/AddCocktailModal.tsx';
import type { CocktailListItem } from './types.ts';

const palette = PALETTES['ébène'];

export default function App() {
  const {
    cocktails, bottles, loading, error,
    activeTab, selectedCocktail, search, isManager, showPin,
    showAddCocktail, editingCocktail, editingBottle, showCategories,
    favorites, availability,
    loadAll,
    toggleBottle, addBottle, updateBottle, deleteBottle,
    addCocktail, updateCocktail, deleteCocktail,
    selectCocktail, clearSelection, setActiveTab, setSearch,
    switchToManager, switchToConsumer, requestManagerMode, closePin,
    toggleFav, toggleAvailability,
    openAddCocktail, closeAddCocktail,
    openEditCocktail, closeEditCocktail,
    openEditBottle, closeEditBottle,
    openCategories, closeCategories,
  } = useStore();

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleSelect = (c: CocktailListItem) => selectCocktail(c);

  const favTabIndex = isManager ? 3 : 2;

  if (loading && cocktails.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08080F', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 36 }}>🍸</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Chargement…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08080F', flexDirection: 'column', gap: 12, padding: 24 }}>
        <div style={{ fontSize: 32 }}>⚠️</div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center' }}>{error}</div>
        <button onClick={loadAll} style={{ padding: '10px 24px', borderRadius: 20, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Réessayer</button>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(160deg, ${palette.bg1} 0%, ${palette.bg2} 100%)`,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'DM Sans', 'Inter', sans-serif",
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Noise overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.5, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")" }} />

      {/* Modals */}
      {showPin && <PinModal onSuccess={switchToManager} onClose={closePin} />}

      {showAddCocktail && (
        <AddCocktailModal
          bottles={bottles}
          onAdd={async (data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await addCocktail({ ...data, ingredients: data.ingredients.map(i => ({ id: i.bottleId, amount: i.amount })) } as any);
          }}
          onClose={closeAddCocktail}
        />
      )}

      {editingCocktail && (
        <AddCocktailModal
          bottles={bottles}
          initialData={{
            id: editingCocktail.id,
            name: editingCocktail.name,
            tagline: editingCocktail.tagline,
            glass: editingCocktail.glass,
            moods: editingCocktail.moods,
            difficulty: editingCocktail.difficulty,
            time: editingCocktail.time,
            garnish: editingCocktail.garnish,
            theme: editingCocktail.theme,
            sceneUrl: editingCocktail.sceneUrl,
            glassUrl: editingCocktail.glassUrl,
            steps: editingCocktail.steps,
            ingredients: editingCocktail.ingredients.map(i => ({ bottleId: i.bottleId, amount: i.amount })),
          }}
          onAdd={async (data) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await updateCocktail(editingCocktail.id, { ...data, ingredients: data.ingredients.map(i => ({ id: i.bottleId, amount: i.amount })) } as any);
          }}
          onDelete={async () => { await deleteCocktail(editingCocktail.id); }}
          onClose={closeEditCocktail}
        />
      )}

      {editingBottle && (
        <EditBottleModal
          bottle={editingBottle}
          onSave={async (data) => { await updateBottle(editingBottle.id, data); }}
          onDelete={async () => { await deleteBottle(editingBottle.id); }}
          onClose={closeEditBottle}
        />
      )}

      {showCategories && (
        <ManageCategoriesModal
          bottles={bottles}
          onClose={closeCategories}
        />
      )}

      {/* Screens */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {selectedCocktail ? (
          <DetailScreen
            cocktail={selectedCocktail}
            onBack={clearSelection}
            isFav={favorites.has(selectedCocktail.id)}
            toggleFav={toggleFav}
            bottles={bottles}
            isManager={isManager}
            onEditCocktail={() => openEditCocktail(selectedCocktail)}
          />
        ) : (
          <>
            {activeTab === 0 && (
              <CatalogueScreen
                cocktails={cocktails}
                onSelect={handleSelect}
                search={search}
                setSearch={setSearch}
                isManager={isManager}
                availability={availability}
                onToggleAvailable={toggleAvailability}
                onSwitchToConsumer={switchToConsumer}
                onRequestManagerMode={requestManagerMode}
                onAddCocktail={openAddCocktail}
                palette={palette}
              />
            )}
            {isManager && activeTab === 1 && (
              <FaisablesScreen cocktails={cocktails} onSelect={handleSelect} />
            )}
            {isManager && activeTab === 2 && (
              <BarScreen
                bottles={bottles}
                toggleBottle={toggleBottle}
                addBottle={addBottle}
                isManager={isManager}
                onEditBottle={openEditBottle}
                onManageCategories={openCategories}
              />
            )}
            {!isManager && activeTab === 1 && (
              <ConsumerCeSoirScreen cocktails={cocktails} onSelect={handleSelect} availability={availability} />
            )}
            {activeTab === favTabIndex && (
              <FavorisScreen cocktails={cocktails} favorites={favorites} onSelect={handleSelect} />
            )}
          </>
        )}
      </div>

      {/* Bottom nav — hidden when detail screen open */}
      {!selectedCocktail && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <BottomNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isManager={isManager}
            accent={palette.accent}
            counts={isManager
              ? { 1: cocktails.filter(c => c.canMake).length, 3: favorites.size }
              : { 2: favorites.size }}
          />
        </div>
      )}

    </div>
  );
}
