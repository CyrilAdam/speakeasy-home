import { useState } from 'react';
import type { CocktailListItem } from '../types.ts';
import { Icon } from './ui/Icon.tsx';
import { DifficultyDots } from './ui/DifficultyDots.tsx';

interface CocktailCardProps {
  cocktail: CocktailListItem;
  onSelect: (c: CocktailListItem) => void;
  isManager?: boolean;
  available?: boolean;
  onToggleAvailable?: (id: string) => void;
}

export const CocktailCard = ({ cocktail, onSelect, isManager = false, available = true, onToggleAvailable }: CocktailCardProps) => {
  const { theme } = cocktail;
  const [pressed, setPressed] = useState(false);
  const dimmed = !available && !isManager;

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => onSelect(cocktail)}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        style={{
          display: 'flex', alignItems: 'center',
          background: `linear-gradient(130deg, ${theme.from} 0%, ${theme.mid} 100%)`,
          border: `1px solid ${theme.accent}40`,
          borderRadius: 22, padding: 0, cursor: 'pointer',
          textAlign: 'left', width: '100%', position: 'relative',
          overflow: 'hidden', minHeight: 86,
          opacity: dimmed ? 0.38 : 1,
          filter: dimmed ? 'saturate(0.15)' : 'none',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
          transition: 'transform 0.14s cubic-bezier(0.4,0,0.2,1), box-shadow 0.14s, opacity 0.3s, filter 0.3s',
          boxShadow: pressed
            ? `0 2px 12px ${theme.from}88`
            : `0 6px 24px ${theme.from}99, 0 1px 0 rgba(255,255,255,0.06) inset`,
        }}
      >
        <div style={{ position: 'absolute', top: -35, right: -25, width: 140, height: 140, borderRadius: '50%', background: theme.to, opacity: 0.28, filter: 'blur(18px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -12, left: 60, width: 60, height: 60, borderRadius: '50%', background: theme.accent, opacity: 0.12, filter: 'blur(10px)', pointerEvents: 'none' }} />

        <div style={{ width: 5, alignSelf: 'stretch', flexShrink: 0, background: `linear-gradient(180deg, ${theme.accent}, ${theme.to})`, borderRadius: '22px 0 0 22px', opacity: 0.9 }} />

        <div style={{ flex: 1, padding: '15px 14px 14px 15px', position: 'relative', zIndex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
            <span style={{ color: '#fff', fontSize: 17, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
              {cocktail.name}
            </span>
            {cocktail.canMake && (
              <span style={{ background: `${theme.accent}30`, border: `1px solid ${theme.accent}55`, color: theme.accent, fontSize: 9.5, fontWeight: 800, padding: '3px 8px', borderRadius: 20, letterSpacing: '0.06em', flexShrink: 0, textTransform: 'uppercase' }}>✓ Faisable</span>
            )}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12.5, marginBottom: 9, letterSpacing: '0.01em' }}>
            {cocktail.tagline}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            {cocktail.moods.slice(0, 2).map(m => (
              <span key={m} style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)', fontSize: 10.5, fontWeight: 500, padding: '2px 9px', borderRadius: 20 }}>{m}</span>
            ))}
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Icon name="clock" size={11} color="rgba(255,255,255,0.45)" />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{cocktail.time}</span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>·</span>
            <DifficultyDots level={cocktail.difficulty} color={theme.accent} />
          </div>
        </div>

        <div style={{ paddingRight: 14, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <Icon name="arrow" size={18} color="rgba(255,255,255,0.3)" />
        </div>

        {!available && !isManager && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.18)', borderRadius: 22, zIndex: 5 }}>
            <span style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.55)', fontSize: 10.5, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase', backdropFilter: 'blur(4px)' }}>Indisponible ce soir</span>
          </div>
        )}
      </button>

      {isManager && (
        <button
          onClick={e => { e.stopPropagation(); onToggleAvailable?.(cocktail.id); }}
          style={{
            position: 'absolute', top: 10, right: 10, zIndex: 10,
            background: available ? `${theme.accent}33` : 'rgba(255,255,255,0.08)',
            border: `1.5px solid ${available ? theme.accent + '66' : 'rgba(255,255,255,0.18)'}`,
            borderRadius: 20, padding: '3px 10px 3px 7px',
            display: 'flex', alignItems: 'center', gap: 4,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
          }}
        >
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: available ? theme.accent : 'rgba(255,255,255,0.3)', boxShadow: available ? `0 0 6px ${theme.accent}` : 'none', transition: 'all 0.2s' }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', color: available ? theme.accent : 'rgba(255,255,255,0.35)' }}>{available ? 'Dispo' : 'Masqué'}</span>
        </button>
      )}
    </div>
  );
};
