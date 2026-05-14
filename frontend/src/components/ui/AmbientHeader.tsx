import type { Palette } from '../../types.ts';
import { PALETTES } from '../../types.ts';

interface AmbientHeaderProps {
  palette?: Palette;
}

export const AmbientHeader = ({ palette }: AmbientHeaderProps) => {
  const p = palette ?? PALETTES['ébène'];
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -40, left: -30, width: 160, height: 160, borderRadius: '50%', background: p.blobs[0], opacity: 0.07, filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', top: -30, right: -20, width: 140, height: 140, borderRadius: '50%', background: p.blobs[1], opacity: 0.07, filter: 'blur(50px)' }} />
      <div style={{ position: 'absolute', top: 40, left: '40%', width: 120, height: 120, borderRadius: '50%', background: p.blobs[2], opacity: 0.06, filter: 'blur(40px)' }} />
    </div>
  );
};
