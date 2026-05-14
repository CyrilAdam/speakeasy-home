interface MoodChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export const MoodChip = ({ label, active, onClick }: MoodChipProps) => (
  <button onClick={onClick} style={{
    padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
    border: active ? '1.5px solid rgba(255,255,255,0.6)' : '1.5px solid rgba(255,255,255,0.12)',
    background: active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
    fontSize: 12, fontWeight: active ? 700 : 400,
    whiteSpace: 'nowrap', letterSpacing: '0.02em',
    transition: 'all 0.18s', fontFamily: 'inherit',
  }}>
    {label}
  </button>
);
