interface DifficultyDotsProps {
  level: number;
  color: string;
}

export const DifficultyDots = ({ level, color }: DifficultyDotsProps) => (
  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
    {[1, 2, 3].map(i => (
      <div key={i} style={{
        width: 5, height: 5, borderRadius: '50%',
        background: i <= level ? color : 'rgba(255,255,255,0.2)',
      }} />
    ))}
  </div>
);
