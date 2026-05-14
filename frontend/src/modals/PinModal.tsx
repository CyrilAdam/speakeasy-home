import { useState } from 'react';
import { Icon } from '../components/ui/Icon.tsx';

interface PinModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

const CORRECT = '1234';

export const PinModal = ({ onSuccess, onClose }: PinModalProps) => {
  const [digits, setDigits] = useState<string[]>([]);
  const [shake, setShake] = useState(false);

  const addDigit = (d: number) => {
    const next = [...digits, String(d)];
    if (next.length === 4) {
      if (next.join('') === CORRECT) {
        onSuccess();
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setDigits([]); }, 500);
      }
    } else {
      setDigits(next);
    }
  };

  const keys: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, '⌫'];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(4,4,12,0.92)', backdropFilter: 'blur(16px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ marginBottom: 10 }}><Icon name="lock" size={28} color="rgba(255,255,255,0.6)" /></div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Mode Gérant</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Entrez votre code PIN</div>
      </div>

      <div style={{ display: 'flex', gap: 18, marginBottom: 36, animation: shake ? 'shakePIN 0.45s' : 'none' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: i < digits.length ? '#A0C4FF' : 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.25)', transition: 'background 0.12s' }} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 68px)', gap: 10 }}>
        {keys.map((k, i) => (
          <button key={i} onClick={() => {
            if (typeof k === 'number') addDigit(k);
            else if (k === '⌫') setDigits(d => d.slice(0, -1));
          }} style={{ width: 68, height: 68, borderRadius: '50%', fontFamily: 'inherit', background: typeof k === 'number' ? 'rgba(255,255,255,0.09)' : 'transparent', border: typeof k === 'number' ? '1px solid rgba(255,255,255,0.12)' : 'none', color: '#fff', fontSize: k === '⌫' ? 20 : 26, fontWeight: 300, cursor: k !== '' ? 'pointer' : 'default' }}>{k}</button>
        ))}
      </div>

      <button onClick={onClose} style={{ marginTop: 24, color: 'rgba(255,255,255,0.35)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>Annuler</button>
      <style>{`@keyframes shakePIN{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}`}</style>
    </div>
  );
};
