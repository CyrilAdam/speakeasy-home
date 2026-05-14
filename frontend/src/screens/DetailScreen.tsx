import { useState } from 'react';
import type { CocktailWithIngredients, Bottle } from '../types.ts';
import { Icon } from '../components/ui/Icon.tsx';

interface DetailScreenProps {
  cocktail: CocktailWithIngredients;
  onBack: () => void;
  isFav: boolean;
  toggleFav: (id: string) => void;
  bottles: Bottle[];
  isManager: boolean;
  onEditCocktail: () => void;
}

export const DetailScreen = ({ cocktail, onBack, isFav, toggleFav, bottles, isManager, onEditCocktail }: DetailScreenProps) => {
  const [tab, setTab] = useState<'recette' | 'ingrédients' | 'illustration'>('recette');
  const { theme } = cocktail;
  const bottleMap = Object.fromEntries(bottles.map(b => [b.id, b]));
  const isOwned = (id: string) => bottleMap[id]?.owned ?? false;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: theme.bg, display: 'flex', flexDirection: 'column', animation: 'slideUp 0.32s cubic-bezier(0.4,0,0.2,1) forwards', overflow: 'hidden' }}>

      {/* Hero background */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 220, overflow: 'hidden', zIndex: 0 }}>
        {cocktail.sceneUrl && (
          <img src={cocktail.sceneUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, ${theme.bg} 100%)` }} />
      </div>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0', flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <button onClick={onBack} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '8px 14px 8px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}>
          <Icon name="back" size={17} color="#fff" />
          Retour
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => toggleFav(cocktail.id)} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '9px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Icon name={isFav ? 'heartFill' : 'heart'} size={20} color={isFav ? '#FF6B8A' : '#fff'} />
          </button>
          {isManager && (
            <button onClick={onEditCocktail} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '9px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: 16 }}>✏️</button>
          )}
        </div>
      </div>

      {/* Hero text */}
      <div style={{ padding: '120px 22px 14px', flexShrink: 0, position: 'relative', zIndex: 2 }}>
        <div style={{ height: 4, width: '38%', borderRadius: 2, marginBottom: 10, background: `linear-gradient(90deg, ${theme.accent}, ${theme.to})` }} />
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 4, textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{cocktail.name}</div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13.5, marginBottom: 10, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{cocktail.tagline}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', borderRadius: 10, padding: '4px 9px' }}>
            <Icon name="clock" size={12} color="rgba(255,255,255,0.6)" />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11.5 }}>{cocktail.time}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', borderRadius: 10, padding: '4px 9px' }}>
            <Icon name="glass" size={12} color="rgba(255,255,255,0.6)" />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11.5 }}>{cocktail.glass}</span>
          </div>
          {cocktail.moods.map(m => (
            <span key={m} style={{ background: `${theme.accent}30`, color: theme.accent, border: `1px solid ${theme.accent}45`, backdropFilter: 'blur(4px)', fontSize: 10.5, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>{m}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', padding: '0 22px', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, background: theme.bg, position: 'relative', zIndex: 2 }}>
        {(['recette', 'ingrédients', 'illustration'] as const).map(key => (
          <button key={key} onClick={() => setTab(key)} style={{ flex: 1, padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: tab === key ? '#fff' : 'rgba(255,255,255,0.32)', fontSize: 12.5, fontWeight: tab === key ? 700 : 400, borderBottom: tab === key ? `2.5px solid ${theme.accent}` : '2.5px solid transparent', fontFamily: 'inherit', transition: 'all 0.18s', textTransform: 'capitalize' }}>
            {key}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 2, overflowY: tab === 'illustration' ? 'hidden' : 'auto', background: theme.bg }}>

        {tab === 'recette' && (
          <div style={{ padding: '14px 22px 24px', display: 'flex', flexDirection: 'column', gap: 9 }}>
            {cocktail.steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 13, alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 14px' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: `${theme.accent}25`, border: `1.5px solid ${theme.accent}55`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: theme.accent, fontSize: 12, fontWeight: 800 }}>{i + 1}</span>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, lineHeight: 1.55, paddingTop: 3 }}>{step}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'ingrédients' && (
          <div style={{ padding: '14px 22px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cocktail.ingredients.map((ing, i) => {
              const owned = isOwned(ing.bottleId);
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: owned ? `${theme.accent}18` : 'rgba(255,255,255,0.05)', border: owned ? `1px solid ${theme.accent}35` : '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 15px' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: owned ? theme.accent : 'rgba(255,255,255,0.15)', boxShadow: owned ? `0 0 10px ${theme.accent}aa` : 'none' }} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: owned ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)' }}>{ing.bottleName}</span>
                  <span style={{ color: owned ? theme.accent : 'rgba(255,255,255,0.2)', fontSize: 13, fontWeight: 700 }}>{ing.amount}</span>
                  {owned && <Icon name="check" size={14} color={theme.accent} />}
                </div>
              );
            })}
            <div style={{ marginTop: 4, padding: '11px 15px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.3)', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Garniture</div>
              <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.65)' }}>{cocktail.garnish}</div>
            </div>
          </div>
        )}

        {tab === 'illustration' && (
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            {cocktail.sceneUrl && (
              <div style={{ position: 'absolute', inset: 0 }}>
                <img src={cocktail.sceneUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,0.25) 0%, ${theme.bg}CC 55%, ${theme.bg}EE 100%)` }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, paddingBottom: 30 }}>
              {cocktail.glassUrl && (
                <div style={{ filter: `drop-shadow(0 0 40px ${theme.accent}99) drop-shadow(0 8px 24px rgba(0,0,0,0.7))`, animation: 'floatGlass 3.5s ease-in-out infinite' }}>
                  <img src={cocktail.glassUrl} alt={cocktail.name} style={{ height: 200, maxWidth: 160, objectFit: 'contain', display: 'block', borderRadius: 12 }} />
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', textShadow: `0 0 20px ${theme.accent}88` }}>{cocktail.name}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{cocktail.tagline}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes floatGlass { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};
