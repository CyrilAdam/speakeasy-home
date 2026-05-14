import { Icon } from './ui/Icon.tsx';

interface BottomNavProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  isManager: boolean;
  accent?: string;
  counts?: Record<number, number>;
}

export const BottomNav = ({ activeTab, setActiveTab, isManager, accent = '#A0C4FF', counts = {} }: BottomNavProps) => {
  const managerTabs = [
    { id: 0, label: 'Cocktails', icon: 'cocktail' },
    { id: 1, label: 'Faisables', icon: 'check' },
    { id: 2, label: 'Mon Bar',   icon: 'bottle' },
    { id: 3, label: 'Favoris',   icon: 'heart' },
  ];
  const consumerTabs = [
    { id: 0, label: 'Menu',    icon: 'cocktail' },
    { id: 1, label: 'Ce soir', icon: 'eye' },
    { id: 2, label: 'Favoris', icon: 'heart' },
  ];
  const tabs = isManager ? managerTabs : consumerTabs;

  return (
    <div style={{ display: 'flex', background: 'rgba(10,10,18,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.07)', paddingBottom: 22, flexShrink: 0 }}>
      {tabs.map(t => {
        const isActive = activeTab === t.id;
        return (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '11px 0 4px', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s', fontFamily: 'inherit' }}>
            {isActive && (
              <div style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: accent, marginTop: -6, boxShadow: `0 0 8px ${accent}` }} />
            )}
            <div style={{ position: 'relative' }}>
              <Icon name={t.icon} size={22} color={isActive ? accent : 'rgba(255,255,255,0.28)'} />
              {(counts[t.id] ?? 0) > 0 && (
                <div style={{ position: 'absolute', top: -5, right: -7, minWidth: 16, height: 16, borderRadius: 8, padding: '0 4px', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: '#0A0A18' }}>{counts[t.id]}</span>
                </div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 400, color: isActive ? accent : 'rgba(255,255,255,0.28)' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
