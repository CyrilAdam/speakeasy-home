// cocktail-scenes.jsx — SVG background scenes + cocktail glass illustrations

// ─── BACKGROUND SCENES ────────────────────────────────────────────────────

function SceneMargarita() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B1500"/><stop offset="28%" stopColor="#D94A10"/>
          <stop offset="55%" stopColor="#F0A020"/><stop offset="56%" stopColor="#245A24"/><stop offset="100%" stopColor="#0F3A0F"/>
        </linearGradient>
        <radialGradient id="mg-sun" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#FFE870"/><stop offset="55%" stopColor="#FFAA20" stopOpacity="0.6"/><stop offset="100%" stopColor="#FF6000" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="mg-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(6,2,0,0.92)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#mg-sky)"/>
      <circle cx="195" cy="118" r="75" fill="url(#mg-sun)"/>
      <circle cx="195" cy="118" r="30" fill="#FFD555" opacity="0.95"/>
      {/* Mountains */}
      <polygon points="0,220 65,158 130,185 205,148 275,172 345,152 390,168 390,280 0,280" fill="#1C4A1C"/>
      <polygon points="0,280 50,218 115,238 185,208 255,228 320,210 390,222 390,280" fill="#0E2E0E"/>
      {/* Cactus L */}
      <rect x="48" y="178" width="11" height="50" rx="5.5" fill="#0A2A0A"/>
      <path d="M53,196 C53,196 38,193 35,182 C32,171 43,169 43,169" fill="none" stroke="#0A2A0A" strokeWidth="8" strokeLinecap="round"/>
      <path d="M53,187 C53,187 66,184 68,173 C70,162 59,160 59,160" fill="none" stroke="#0A2A0A" strokeWidth="8" strokeLinecap="round"/>
      {/* Cactus R */}
      <rect x="335" y="164" width="13" height="60" rx="6.5" fill="#0A2A0A"/>
      <path d="M341,184 C341,184 326,181 323,170 C320,159 332,157 332,157" fill="none" stroke="#0A2A0A" strokeWidth="9" strokeLinecap="round"/>
      {/* Stars */}
      {[[22,18],[88,9],[168,26],[252,11],[322,21],[378,7]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.5"/>
      ))}
      {/* Tiles */}
      {[0,1,2,3,4,5].map(i=>(
        <rect key={i} x={i*70-10} y="262" width="60" height="18" rx="2" fill="rgba(180,80,20,0.25)" stroke="rgba(200,100,30,0.2)" strokeWidth="1"/>
      ))}
      <rect width="390" height="280" fill="url(#mg-vign)"/>
    </svg>
  );
}

function SceneNegroni() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ng-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A0500"/><stop offset="100%" stopColor="#3A0C00"/>
        </linearGradient>
        <radialGradient id="ng-lamp" cx="50%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#E87020" stopOpacity="0.5"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="ng-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="50%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(4,1,0,0.95)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#ng-bg)"/>
      {/* Venetian blind shadows */}
      {[0,1,2,3,4,5,6,7].map(i=>(
        <rect key={i} x="0" y={i*28+10} width="390" height="10" fill="rgba(0,0,0,0.35)"/>
      ))}
      {/* Warm lamp glow */}
      <ellipse cx="195" cy="80" rx="160" ry="110" fill="url(#ng-lamp)"/>
      {/* Ceiling lamp */}
      <line x1="195" y1="0" x2="195" y2="35" stroke="#8B5A1A" strokeWidth="3"/>
      <ellipse cx="195" cy="38" rx="22" ry="12" fill="#2A1200"/>
      <ellipse cx="195" cy="34" rx="16" ry="7" fill="#E87020" opacity="0.9"/>
      {/* Bar counter top */}
      <rect x="0" y="200" width="390" height="14" rx="2" fill="#5A2800"/>
      <rect x="0" y="210" width="390" height="70" fill="#3A1600"/>
      {/* Marble veins on counter */}
      <path d="M20,204 Q100,200 180,206 Q260,212 350,204" fill="none" stroke="rgba(200,160,100,0.2)" strokeWidth="1"/>
      <path d="M50,208 Q140,204 220,210 Q300,216 370,207" fill="none" stroke="rgba(200,160,100,0.15)" strokeWidth="1"/>
      {/* Bottles on shelf */}
      <rect x="0" y="130" width="390" height="3" fill="#5A2800"/>
      {[30,70,115,155,195,235,275,315,355].map((x,i)=>{
        const h = [52,44,60,38,56,42,50,46,40][i];
        const col = ["#8B0000","#C04000","#D4A000","#006030","#003060","#800040","#C08000","#503000","#004040"][i];
        return (
          <g key={i}>
            <rect x={x-6} y={132-h} width="12" height={h} rx="3" fill={col} opacity="0.85"/>
            <rect x={x-4} y={132-h-6} width="8" height="8" rx="2" fill={col} opacity="0.6"/>
          </g>
        );
      })}
      {/* Mirror behind bar (dark reflective) */}
      <rect x="10" y="60" width="370" height="70" rx="4" fill="rgba(255,120,40,0.05)" stroke="rgba(180,90,20,0.3)" strokeWidth="1"/>
      <rect width="390" height="280" fill="url(#ng-vign)"/>
    </svg>
  );
}

function SceneMoscowMule() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mm-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080818"/><stop offset="60%" stopColor="#141428"/><stop offset="100%" stopColor="#201A10"/>
        </linearGradient>
        <linearGradient id="mm-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(4,3,1,0.95)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#mm-sky)"/>
      {/* Stars */}
      {Array.from({length:28},(_,i)=>([Math.random()*390,Math.random()*120])).map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={Math.random()*1.5+0.5} fill="white" opacity={Math.random()*0.6+0.2}/>
      ))}
      {/* Moon */}
      <circle cx="52" cy="45" r="22" fill="#E8D888" opacity="0.9"/>
      <circle cx="60" cy="40" r="20" fill="#0D0D22" opacity="0.9"/>
      {/* NYC skyline silhouette */}
      {[
        [0,180,28,100],[28,210,18,70],[46,195,22,85],[68,170,30,110],[98,200,16,80],[114,185,20,95],[134,175,14,105],
        [148,165,26,115],[174,180,20,100],[194,155,34,125],[228,168,22,112],[250,178,18,102],[268,190,24,90],[292,172,16,108],
        [308,185,20,95],[328,175,18,105],[346,188,16,92],[362,178,14,102],[376,190,14,90]
      ].map(([x,y,w,h],i)=>(
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#1A1828"/>
          {/* Windows */}
          {Array.from({length:Math.floor(h/14)},(_,j)=>(
            <rect key={j} x={x+4} y={y+j*12+6} width={Math.min(w-8,8)} height={5} fill={Math.random()>0.4?"#E8A820":"rgba(200,160,60,0.2)"} opacity={Math.random()*0.6+0.3}/>
          ))}
        </g>
      ))}
      {/* Bridge cable towers */}
      <rect x="120" y="100" width="10" height="120" fill="#252535"/>
      <rect x="260" y="100" width="10" height="120" fill="#252535"/>
      {/* Bridge cables */}
      <path d="M125,100 Q195,155 265,100" fill="none" stroke="#353545" strokeWidth="1.5"/>
      <path d="M125,115 Q195,165 265,115" fill="none" stroke="#353545" strokeWidth="1"/>
      {/* Water reflections */}
      <rect x="0" y="220" width="390" height="60" fill="#100E1C" opacity="0.9"/>
      {Array.from({length:12},(_,i)=>(
        <line key={i} x1={i*35+5} y1="230" x2={i*35+25} y2="230" stroke="#C87820" strokeWidth="1.5" opacity={0.15+Math.random()*0.2}/>
      ))}
      <rect width="390" height="280" fill="url(#mm-vign)"/>
    </svg>
  );
}

function SceneMojito() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="mo-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#001A40"/><stop offset="40%" stopColor="#004070"/><stop offset="65%" stopColor="#0080A0"/><stop offset="66%" stopColor="#00C0A0"/><stop offset="80%" stopColor="#00D8C0"/><stop offset="100%" stopColor="#E8E0C0"/>
        </linearGradient>
        <radialGradient id="mo-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F8F0D0"/><stop offset="70%" stopColor="#E8D888"/><stop offset="100%" stopColor="#C8B860" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="mo-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(0,8,4,0.95)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#mo-sky)"/>
      {/* Moon + reflection */}
      <circle cx="295" cy="52" r="28" fill="url(#mo-moon)"/>
      {/* Stars */}
      {[[20,22],[65,15],[130,30],[200,8],[245,25],[355,18],[378,38]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.65"/>
      ))}
      {/* Palm tree L */}
      <rect x="42" y="110" width="10" height="130" rx="5" fill="#3A2200" style={{transform:"rotate(-6deg)",transformOrigin:"47px 240px"}}/>
      <ellipse cx="40" cy="112" rx="42" ry="18" fill="#0A5A18" style={{transform:"rotate(-30deg)",transformOrigin:"40px 112px"}}/>
      <ellipse cx="42" cy="115" rx="38" ry="15" fill="#0E6E20" style={{transform:"rotate(10deg)",transformOrigin:"42px 115px"}}/>
      <ellipse cx="44" cy="118" rx="36" ry="14" fill="#0A5A18" style={{transform:"rotate(50deg)",transformOrigin:"44px 118px"}}/>
      {/* Palm tree R */}
      <rect x="338" y="95" width="10" height="140" rx="5" fill="#3A2200" style={{transform:"rotate(5deg)",transformOrigin:"343px 235px"}}/>
      <ellipse cx="340" cy="97" rx="44" ry="18" fill="#0E6E20" style={{transform:"rotate(25deg)",transformOrigin:"340px 97px"}}/>
      <ellipse cx="338" cy="100" rx="38" ry="14" fill="#0A5A18" style={{transform:"rotate(-15deg)",transformOrigin:"338px 100px"}}/>
      <ellipse cx="340" cy="103" rx="36" ry="14" fill="#0E6E20" style={{transform:"rotate(-55deg)",transformOrigin:"340px 103px"}}/>
      {/* Ocean shimmer */}
      {[0,1,2,3].map(i=>(
        <path key={i} d={`M${i*110},${180+i*4} Q${i*110+55},${176+i*4} ${i*110+110},${180+i*4}`} fill="none" stroke="#40E8D0" strokeWidth="1.5" opacity="0.3"/>
      ))}
      {/* Moon reflection path */}
      <path d="M260,182 Q295,172 330,182" fill="none" stroke="#F8E880" strokeWidth="2" opacity="0.4"/>
      {/* Sand */}
      <path d="M0,240 Q95,225 195,235 Q295,245 390,228 L390,280 L0,280Z" fill="#D4C888"/>
      {/* Sand texture */}
      {[[40,252],[110,258],[180,248],[250,255],[320,250],[370,258]].map(([x,y],i)=>(
        <ellipse key={i} cx={x} cy={y} rx="12" ry="4" fill="rgba(180,160,80,0.3)"/>
      ))}
      <rect width="390" height="280" fill="url(#mo-vign)"/>
    </svg>
  );
}

function SceneCosmopolitan() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cos-sky" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#1A0025"/><stop offset="40%" stopColor="#3D0050"/><stop offset="70%" stopColor="#8B005A"/><stop offset="100%" stopColor="#1A0020"/>
        </linearGradient>
        <radialGradient id="cos-glow" cx="50%" cy="60%" r="55%">
          <stop offset="0%" stopColor="#FF40A0" stopOpacity="0.25"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="cos-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(5,0,8,0.96)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#cos-sky)"/>
      <rect width="390" height="280" fill="url(#cos-glow)"/>
      {/* Stars */}
      {Array.from({length:30},(_,i)=>([i*13+Math.random()*10,Math.random()*100])).map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.2" fill="white" opacity={0.3+Math.random()*0.5}/>
      ))}
      {/* Dense NYC skyline */}
      {[
        [0,185,22,95],[22,195,16,85],[38,178,28,102],[66,168,20,112],[86,155,36,125],[122,172,18,108],
        [140,160,26,120],[166,148,20,132],[186,140,38,140],[224,158,22,122],[246,170,18,110],
        [264,162,30,118],[294,175,16,105],[310,168,24,112],[334,180,20,100],[354,172,16,108],[370,182,20,98]
      ].map(([x,y,w,h],i)=>(
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="#110018"/>
          {Array.from({length:Math.ceil(h/11)},(_,j)=>
            Array.from({length:Math.floor(w/9)},(_,k)=>(
              <rect key={`${j}-${k}`} x={x+k*9+2} y={y+j*10+3} width="5" height="5"
                fill={Math.random()>0.35?"#FF80C0":"rgba(255,100,180,0.08)"} opacity={0.3+Math.random()*0.65}/>
            ))
          )}
        </g>
      ))}
      {/* Empire State spire */}
      <polygon points="199,82 205,140 193,140" fill="#220030"/>
      <rect x="200" y="80" width="4" height="28" fill="#FF60B0" opacity="0.7"/>
      {/* Water reflections */}
      <rect x="0" y="228" width="390" height="52" fill="#0D0015"/>
      {Array.from({length:16},(_,i)=>(
        <line key={i} x1={i*26+3} y1={235+Math.random()*8} x2={i*26+18} y2={235+Math.random()*8} stroke="#FF60B0" strokeWidth="1.2" opacity={0.1+Math.random()*0.2}/>
      ))}
      <rect width="390" height="280" fill="url(#cos-vign)"/>
    </svg>
  );
}

function SceneOldFashioned() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="of-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#100800"/><stop offset="100%" stopColor="#280E00"/>
        </linearGradient>
        <radialGradient id="of-lamp" cx="30%" cy="25%" r="45%">
          <stop offset="0%" stopColor="#C07010" stopOpacity="0.55"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="of-lamp2" cx="75%" cy="20%" r="38%">
          <stop offset="0%" stopColor="#A06010" stopOpacity="0.4"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="of-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(4,2,0,0.97)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#of-bg)"/>
      <rect width="390" height="280" fill="url(#of-lamp)"/>
      <rect width="390" height="280" fill="url(#of-lamp2)"/>
      {/* Brick wall */}
      {Array.from({length:8},(_,row)=>
        Array.from({length:7},(_,col)=>{
          const offset = row%2===0?0:28;
          return <rect key={`${row}-${col}`} x={col*56+offset-4} y={row*22+5} width="50" height="18" rx="1"
            fill={`rgba(${100+row*5},${40+col*3},${10+row*2},0.5)`} stroke="rgba(60,25,5,0.4)" strokeWidth="0.5"/>;
        })
      )}
      {/* Gas lamp L */}
      <line x1="80" y1="0" x2="80" y2="55" stroke="#5A3010" strokeWidth="4"/>
      <ellipse cx="80" cy="60" rx="16" ry="22" fill="#2A1400"/>
      <ellipse cx="80" cy="58" rx="10" ry="14" fill="#E88020" opacity="0.95"/>
      <circle cx="80" cy="58" r="6" fill="#FFD060" opacity="0.9"/>
      {/* Gas lamp R */}
      <line x1="310" y1="0" x2="310" y2="55" stroke="#5A3010" strokeWidth="4"/>
      <ellipse cx="310" cy="60" rx="16" ry="22" fill="#2A1400"/>
      <ellipse cx="310" cy="58" rx="10" ry="14" fill="#E88020" opacity="0.95"/>
      <circle cx="310" cy="58" r="6" fill="#FFD060" opacity="0.9"/>
      {/* Bar counter */}
      <rect x="0" y="196" width="390" height="12" rx="3" fill="#6A3500"/>
      <rect x="0" y="205" width="390" height="75" fill="#3D1E00"/>
      {/* Wood grain */}
      {[210,218,226,234].map((y,i)=>(
        <path key={i} d={`M0,${y} Q130,${y+3} 260,${y-2} Q330,${y+1} 390,${y}`} fill="none" stroke="rgba(100,50,0,0.3)" strokeWidth="0.8"/>
      ))}
      {/* Bottles on shelf */}
      <rect x="0" y="160" width="390" height="3" fill="#5A3010"/>
      {[25,65,105,150,195,240,280,320,360].map((x,i)=>{
        const cols = ["#7B0000","#3A1200","#DAA000","#004020","#3A0060","#B06000","#002040","#600020","#304000"];
        const hs = [48,42,56,38,52,40,50,44,38];
        return (
          <g key={i}>
            <rect x={x-7} y={162-hs[i]} width="14" height={hs[i]} rx="4" fill={cols[i]} opacity="0.9"/>
            <rect x={x-4} y={162-hs[i]-5} width="8" height="7" rx="2" fill={cols[i]} opacity="0.7"/>
            <rect x={x-7} y={162-hs[i]+4} width="14" height="5" rx="0" fill="rgba(255,220,150,0.2)"/>
          </g>
        );
      })}
      <rect width="390" height="280" fill="url(#of-vign)"/>
    </svg>
  );
}

function SceneLastWord() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lw-bg" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#050E00"/><stop offset="100%" stopColor="#0A1E05"/>
        </linearGradient>
        <radialGradient id="lw-glow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#60A000" stopOpacity="0.22"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="lw-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C8A000"/><stop offset="100%" stopColor="#E8CC40"/>
        </linearGradient>
        <linearGradient id="lw-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="35%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(2,5,0,0.96)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#lw-bg)"/>
      <rect width="390" height="280" fill="url(#lw-glow)"/>
      {/* Art deco arch frame */}
      <path d="M80,280 L80,120 Q195,40 310,120 L310,280" fill="none" stroke="url(#lw-gold)" strokeWidth="2.5" opacity="0.7"/>
      <path d="M100,280 L100,128 Q195,58 290,128 L290,280" fill="none" stroke="rgba(180,140,0,0.25)" strokeWidth="1"/>
      {/* Inner arch glow */}
      <path d="M80,280 L80,120 Q195,40 310,120 L310,280 Q245,255 195,260 Q145,255 80,280Z" fill="rgba(60,100,0,0.08)"/>
      {/* Geometric diamond pattern */}
      {[[-1,0],[0,-1],[1,0],[0,1]].map(([dx,dy],i)=>(
        <polygon key={i} points={`195,${140+dy*60} ${195+dx*60},140 195,${140-dy*60} ${195-dx*60},140`}
          fill="none" stroke="url(#lw-gold)" strokeWidth="1.2" opacity="0.4"/>
      ))}
      {/* Starburst center */}
      {Array.from({length:12},(_,i)=>{
        const angle = (i/12)*Math.PI*2;
        return <line key={i} x1="195" y1="140" x2={195+Math.cos(angle)*55} y2={140+Math.sin(angle)*55}
          stroke="#B0A000" strokeWidth="0.8" opacity="0.35"/>;
      })}
      <circle cx="195" cy="140" r="12" fill="none" stroke="url(#lw-gold)" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="195" cy="140" r="5" fill="#80C000" opacity="0.5"/>
      {/* Pilasters */}
      <rect x="28" y="0" width="14" height="280" fill="rgba(180,140,0,0.08)" stroke="url(#lw-gold)" strokeWidth="0.8" opacity="0.5"/>
      <rect x="348" y="0" width="14" height="280" fill="rgba(180,140,0,0.08)" stroke="url(#lw-gold)" strokeWidth="0.8" opacity="0.5"/>
      {/* Capital detail top */}
      {[28,348].map(x=>(
        <g key={x}>
          <rect x={x} y="0" width="14" height="20" fill="rgba(180,140,0,0.15)"/>
          <line x1={x} y1="20" x2={x+14} y2="20" stroke="url(#lw-gold)" strokeWidth="1.5" opacity="0.7"/>
        </g>
      ))}
      {/* Floor */}
      <rect x="0" y="248" width="390" height="32" fill="rgba(30,50,5,0.5)"/>
      {/* Floor geometric tiles */}
      {Array.from({length:7},(_,i)=>(
        <polygon key={i} points={`${i*60-10},280 ${i*60+20},248 ${i*60+50},248 ${i*60+20},280`}
          fill="rgba(160,200,0,0.07)" stroke="rgba(180,140,0,0.2)" strokeWidth="0.8"/>
      ))}
      <rect width="390" height="280" fill="url(#lw-vign)"/>
    </svg>
  );
}

function ScenePaperPlane() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="pp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A0600"/><stop offset="100%" stopColor="#1A0E00"/>
        </linearGradient>
        <radialGradient id="pp-neon1" cx="25%" cy="35%" r="35%">
          <stop offset="0%" stopColor="#E87000" stopOpacity="0.3"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="pp-neon2" cx="75%" cy="30%" r="30%">
          <stop offset="0%" stopColor="#E84000" stopOpacity="0.2"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="pp-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="35%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(4,2,0,0.97)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#pp-bg)"/>
      <rect width="390" height="280" fill="url(#pp-neon1)"/>
      <rect width="390" height="280" fill="url(#pp-neon2)"/>
      {/* Clean concrete architecture — vertical lines */}
      {[60,130,200,260,330].map((x,i)=>(
        <line key={i} x1={x} y1="0" x2={x} y2="280" stroke="rgba(100,60,0,0.2)" strokeWidth="1"/>
      ))}
      {/* Ceiling grid */}
      {[0,1,2].map(y=>(
        <line key={y} x1="0" y1={y*35+15} x2="390" y2={y*35+15} stroke="rgba(100,60,0,0.15)" strokeWidth="1"/>
      ))}
      {/* Neon sign "BAR" */}
      <text x="195" y="88" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="900"
        fill="none" stroke="#E87000" strokeWidth="2" opacity="0.85" style={{filter:"blur(0.5px)"}}>BAR</text>
      <text x="195" y="88" textAnchor="middle" fontFamily="monospace" fontSize="38" fontWeight="900"
        fill="#E87000" opacity="0.3">BAR</text>
      {/* Neon underline glow */}
      <line x1="135" y1="96" x2="255" y2="96" stroke="#E87000" strokeWidth="2" opacity="0.7"/>
      <line x1="135" y1="96" x2="255" y2="96" stroke="#E87000" strokeWidth="6" opacity="0.15"/>
      {/* Minimal shelf */}
      <rect x="20" y="140" width="350" height="2" fill="rgba(180,120,40,0.4)"/>
      {/* Bottles (minimal, geometric) */}
      {[50,100,155,205,255,310,360].map((x,i)=>{
        const h = [45,38,52,42,48,36,50][i];
        const c = ["#8B4000","#5A2800","#D4A000","#3A1A00","#A06000","#280A00","#703000"][i];
        return (
          <g key={i}>
            <rect x={x-5} y={142-h} width="10" height={h} rx="2" fill={c} opacity="0.75"/>
            <rect x={x-3} y={142-h-5} width="6" height="7" rx="1.5" fill={c} opacity="0.6"/>
          </g>
        );
      })}
      {/* Bar top */}
      <rect x="0" y="198" width="390" height="10" rx="0" fill="#2A1400"/>
      <rect x="0" y="207" width="390" height="73" fill="#180C00"/>
      {/* Bar top edge highlight */}
      <line x1="0" y1="198" x2="390" y2="198" stroke="#E87000" strokeWidth="1.5" opacity="0.5"/>
      <line x1="0" y1="198" x2="390" y2="198" stroke="#E87000" strokeWidth="6" opacity="0.08"/>
      <rect width="390" height="280" fill="url(#pp-vign)"/>
    </svg>
  );
}

function SceneSpritz() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7B2000"/><stop offset="35%" stopColor="#D05010"/>
          <stop offset="65%" stopColor="#F0A030"/><stop offset="66%" stopColor="#2060A0"/><stop offset="100%" stopColor="#003060"/>
        </linearGradient>
        <radialGradient id="sp-sun" cx="62%" cy="62%" r="40%">
          <stop offset="0%" stopColor="#FFE060"/><stop offset="50%" stopColor="#FFA020" stopOpacity="0.5"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="sp-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="35%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(5,2,0,0.95)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#sp-sky)"/>
      <circle cx="245" cy="168" r="60" fill="url(#sp-sun)"/>
      <circle cx="245" cy="168" r="25" fill="#FFE055" opacity="0.85"/>
      {/* Venetian architecture L */}
      <rect x="0" y="60" width="105" height="190" fill="#A04010" opacity="0.85"/>
      <rect x="8" y="70" width="89" height="170" fill="#B85020" opacity="0.7"/>
      {/* Windows L */}
      {[0,1,2,3].map(row=>[0,1].map(col=>(
        <g key={`${row}-${col}`}>
          <rect x={16+col*44} y={80+row*40} width="32" height="28" rx="16" fill="#1A3A60" opacity="0.7" stroke="rgba(255,200,100,0.3)" strokeWidth="1"/>
          <rect x={16+col*44} y={80+row*40} width="32" height="14" rx="16 16 0 0" fill="rgba(255,200,100,0.12)"/>
        </g>
      )))}
      {/* Venetian architecture R */}
      <rect x="285" y="45" width="105" height="205" fill="#903810" opacity="0.85"/>
      <rect x="293" y="55" width="89" height="185" fill="#A84820" opacity="0.7"/>
      {/* Windows R */}
      {[0,1,2,3,4].map(row=>[0,1].map(col=>(
        <g key={`${row}-${col}`}>
          <rect x={298+col*44} y={65+row*38} width="30" height="26" rx="15" fill="#1A3A60" opacity="0.7" stroke="rgba(255,200,100,0.3)" strokeWidth="1"/>
        </g>
      )))}
      {/* Grand canal water */}
      <rect x="100" y="180" width="190" height="100" fill="#1848A0" opacity="0.85"/>
      {/* Canal reflections */}
      {[0,1,2,3,4].map(i=>(
        <path key={i} d={`M105,${200+i*12} Q195,${196+i*12} 285,${200+i*12}`} fill="none" stroke="rgba(255,180,50,0.2)" strokeWidth="1.5"/>
      ))}
      {/* Bridge */}
      <path d="M85,210 Q195,180 305,210" fill="none" stroke="#8B4010" strokeWidth="10" opacity="0.9"/>
      <path d="M85,210 Q195,180 305,210" fill="none" stroke="#C06020" strokeWidth="4" opacity="0.7"/>
      <rect x="75" y="208" width="30" height="30" fill="#8B4010"/>
      <rect x="285" y="208" width="30" height="30" fill="#8B4010"/>
      <rect width="390" height="280" fill="url(#sp-vign)"/>
    </svg>
  );
}

function SceneGimlet() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="gi-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#010810"/><stop offset="55%" stopColor="#021525"/><stop offset="56%" stopColor="#031A30"/><stop offset="100%" stopColor="#050E20"/>
        </linearGradient>
        <radialGradient id="gi-moon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C8E8F0"/><stop offset="65%" stopColor="#80C0D0" stopOpacity="0.5"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="gi-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="35%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(1,3,5,0.96)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#gi-sky)"/>
      {/* Stars */}
      {Array.from({length:35},(_,i)=>([i*11+Math.random()*8,Math.random()*130])).map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={Math.random()*1.4+0.4} fill="white" opacity={0.2+Math.random()*0.6}/>
      ))}
      {/* Moon */}
      <circle cx="310" cy="55" r="32" fill="url(#gi-moon)"/>
      <circle cx="300" cy="50" r="28" fill="#030C18" opacity="0.75"/>
      {/* Porthole frame */}
      <circle cx="195" cy="120" r="80" fill="none" stroke="#5A8090" strokeWidth="8" opacity="0.7"/>
      <circle cx="195" cy="120" r="72" fill="rgba(3,20,35,0.6)" stroke="#406070" strokeWidth="2" opacity="0.5"/>
      <circle cx="195" cy="120" r="80" fill="none" stroke="rgba(180,220,255,0.15)" strokeWidth="1"/>
      {/* Porthole bolts */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>{
        const rad = (a * Math.PI)/180;
        return <circle key={i} cx={195+Math.cos(rad)*85} cy={120+Math.sin(rad)*85} r="5" fill="#406070" stroke="#5A8090" strokeWidth="1.5" opacity="0.8"/>;
      })}
      {/* Through porthole: horizon */}
      <clipPath id="gi-port"><circle cx="195" cy="120" r="70"/></clipPath>
      <rect x="120" y="120" width="150" height="70" fill="#02101C" opacity="0.9" clipPath="url(#gi-port)"/>
      <path d="M120,125 Q195,118 265,125" fill="none" stroke="#40A0C0" strokeWidth="1.5" opacity="0.5" clipPath="url(#gi-port)"/>
      {/* Moon reflection in porthole */}
      <path d="M165,145 Q195,138 225,145" fill="none" stroke="#80C8E0" strokeWidth="1.5" opacity="0.4" clipPath="url(#gi-port)"/>
      {/* Ship deck rail */}
      <rect x="0" y="210" width="390" height="4" fill="#2A4050" opacity="0.9"/>
      <rect x="0" y="218" width="390" height="62" fill="#182030"/>
      {/* Deck planks */}
      {[220,226,232,238,244].map((y,i)=>(
        <line key={i} x1="0" y1={y} x2="390" y2={y} stroke="rgba(40,80,100,0.3)" strokeWidth="1"/>
      ))}
      {/* Rope coil */}
      {[0,1,2,3,4].map(i=>(
        <ellipse key={i} cx="55" cy={240+i*3} rx={20-i*2} ry="4" fill="none" stroke="#604020" strokeWidth="2" opacity={0.6-i*0.1}/>
      ))}
      <rect width="390" height="280" fill="url(#gi-vign)"/>
    </svg>
  );
}

function SceneTequilaSunrise() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ts-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#050028"/><stop offset="25%" stopColor="#3A0060"/>
          <stop offset="50%" stopColor="#8B1A00"/><stop offset="70%" stopColor="#D04000"/>
          <stop offset="85%" stopColor="#F07010"/><stop offset="100%" stopColor="#F8A820"/>
        </linearGradient>
        <radialGradient id="ts-sun" cx="50%" cy="96%" r="35%">
          <stop offset="0%" stopColor="#FFE060"/><stop offset="40%" stopColor="#FF8020" stopOpacity="0.7"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="ts-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="45%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(5,1,0,0.96)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#ts-sky)"/>
      <rect width="390" height="280" fill="url(#ts-sun)"/>
      {/* Stars fading */}
      {[[25,20],[80,12],[150,30],[220,15],[295,25],[360,10]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.4"/>
      ))}
      {/* Rising sun disk */}
      <path d="M140,280 A55,55 0 0 1 250,280" fill="#FFD050" opacity="0.95"/>
      <path d="M120,280 A75,75 0 0 1 270,280" fill="#FFA030" opacity="0.4"/>
      {/* Mountain range */}
      <polygon points="0,200 55,148 110,175 175,138 240,160 295,132 350,155 390,140 390,280 0,280" fill="#1A0A00"/>
      <polygon points="0,280 40,225 95,248 160,215 225,238 285,212 345,235 390,220 390,280" fill="#0D0500"/>
      {/* Agave plants */}
      {[[55,225],[175,215],[300,220],[370,228]].map(([x,y],i)=>(
        <g key={i}>
          <ellipse cx={x} cy={y} rx="16" ry="6" fill="#1A4010" style={{transform:`rotate(-25deg)`,transformOrigin:`${x}px ${y}px`}}/>
          <ellipse cx={x} cy={y} rx="16" ry="6" fill="#143010" style={{transform:`rotate(25deg)`,transformOrigin:`${x}px ${y}px`}}/>
          <ellipse cx={x} cy={y} rx="16" ry="6" fill="#1A4010" style={{transform:`rotate(0deg)`,transformOrigin:`${x}px ${y}px`}}/>
          <rect x={x-2} y={y-14} width="4" height="14" rx="2" fill="#1A4010"/>
        </g>
      ))}
      <rect width="390" height="280" fill="url(#ts-vign)"/>
    </svg>
  );
}

function SceneB52() {
  return (
    <svg viewBox="0 0 390 280" style={{width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="b5-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#030100"/><stop offset="100%" stopColor="#0A0400"/>
        </linearGradient>
        <radialGradient id="b5-glow1" cx="30%" cy="35%" r="30%">
          <stop offset="0%" stopColor="#C03000" stopOpacity="0.3"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <radialGradient id="b5-glow2" cx="70%" cy="25%" r="25%">
          <stop offset="0%" stopColor="#804000" stopOpacity="0.25"/><stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <linearGradient id="b5-vign" x1="0" y1="0" x2="0" y2="1">
          <stop offset="30%" stopColor="transparent"/><stop offset="100%" stopColor="rgba(2,0,0,0.97)"/>
        </linearGradient>
      </defs>
      <rect width="390" height="280" fill="url(#b5-bg)"/>
      <rect width="390" height="280" fill="url(#b5-glow1)"/>
      <rect width="390" height="280" fill="url(#b5-glow2)"/>
      {/* Rough stone/concrete wall texture */}
      {Array.from({length:9},(_,row)=>Array.from({length:5},(_,col)=>(
        <rect key={`${row}-${col}`} x={col*82+row%2*38-5} y={row*28+2} width="74" height="22" rx="0"
          fill={`rgba(${12+row},${6+col},${0},${0.4+row*0.04})`} stroke="rgba(30,8,0,0.5)" strokeWidth="1"/>
      )))}
      {/* Neon sign 1 */}
      <text x="100" y="72" textAnchor="middle" fontFamily="serif" fontSize="22" fontWeight="900"
        fill="none" stroke="#C02800" strokeWidth="1.5" opacity="0.9">SHOTS</text>
      <text x="100" y="72" textAnchor="middle" fontFamily="serif" fontSize="22" fill="#C02800" opacity="0.2"/>
      <rect x="50" y="76" width="100" height="1.5" fill="#C02800" opacity="0.7"/>
      {/* Neon sign 2 */}
      <text x="295" y="55" textAnchor="middle" fontFamily="serif" fontSize="18" fontWeight="700"
        fill="none" stroke="#904000" strokeWidth="1.5" opacity="0.85">OPEN</text>
      {/* Bar grill on window */}
      {[[-1,0],[0,-1],[1,0],[0,1]].map(([dx,dy],i)=>(
        <rect key={i} x={228+dx*2} y={100+dy*2} width="72" height="55" rx="0"
          fill="rgba(20,8,0,0.5)" stroke="rgba(80,30,0,0.4)" strokeWidth="2"/>
      ))}
      <rect x="230" y="102" width="68" height="51" rx="1" fill="rgba(30,10,0,0.7)" stroke="rgba(80,30,0,0.4)" strokeWidth="1"/>
      {[6,14,22,30].map(i=>(
        <line key={i} x1="230" y1={102+i*6} x2="298" y2={102+i*6} stroke="rgba(80,30,0,0.6)" strokeWidth="1.5"/>
      ))}
      {[8,18,28,38,48,58].map(i=>(
        <line key={i} x1={230+i} y1="102" x2={230+i} y2="153" stroke="rgba(80,30,0,0.6)" strokeWidth="1.5"/>
      ))}
      {/* Bar counter */}
      <rect x="0" y="200" width="390" height="8" rx="0" fill="#180800"/>
      <rect x="0" y="205" width="390" height="75" fill="#0D0400"/>
      <line x1="0" y1="200" x2="390" y2="200" stroke="#C03000" strokeWidth="1.5" opacity="0.6"/>
      <line x1="0" y1="200" x2="390" y2="200" stroke="#C03000" strokeWidth="6" opacity="0.07"/>
      {/* Skull on shelf */}
      <rect x="0" y="168" width="390" height="2" fill="#3A1200"/>
      {[25,75,128,178,228,280,332,362].map((x,i)=>{
        const cols = ["#5A0000","#3A1800","#6A2000","#280000","#4A2800","#1A0800","#602000","#302800"];
        const hs = [38,32,44,28,40,34,42,30];
        return (
          <g key={i}>
            <rect x={x-6} y={170-hs[i]} width="12" height={hs[i]} rx="3" fill={cols[i]} opacity="0.85"/>
            <rect x={x-4} y={170-hs[i]-4} width="8" height="6" rx="2" fill={cols[i]} opacity="0.6"/>
          </g>
        );
      })}
      <rect width="390" height="280" fill="url(#b5-vign)"/>
    </svg>
  );
}

// ─── Map cocktail id → scene component ───────────────────────────────────
const COCKTAIL_SCENES = {
  "margarita":      SceneMargarita,
  "negroni":        SceneNegroni,
  "moscow-mule":    SceneMoscowMule,
  "mojito":         SceneMojito,
  "cosmopolitan":   SceneCosmopolitan,
  "old-fashioned":  SceneOldFashioned,
  "last-word":      SceneLastWord,
  "paper-plane":    ScenePaperPlane,
  "spritz":         SceneSpritz,
  "gimlet":         SceneGimlet,
  "tequila-sunrise":SceneTequilaSunrise,
  "b52":            SceneB52,
};

// ─── GLASS ILLUSTRATIONS ─────────────────────────────────────────────────

function GlassMartini({ fill, accent, rim, garnish }) {
  return (
    <svg viewBox="0 0 200 260" width="160" height="208">
      {/* Rim salt/sugar */}
      {rim && <ellipse cx="100" cy="44" rx="73" ry="8" fill="none" stroke="white" strokeWidth="3.5" strokeDasharray="5 3" opacity="0.7"/>}
      {/* Glass bowl */}
      <path d="M27,46 L100,158 L173,46 Z" fill={`${fill}35`} stroke="rgba(255,255,255,0.45)" strokeWidth="1.5"/>
      {/* Liquid fill */}
      <path d="M42,72 L100,158 L158,72 Z" fill={`${fill}88`}/>
      {/* Highlight */}
      <path d="M42,72 L60,100 L80,72 Z" fill="rgba(255,255,255,0.12)"/>
      {/* Stem */}
      <line x1="100" y1="158" x2="100" y2="218" stroke="rgba(255,255,255,0.4)" strokeWidth="3"/>
      {/* Base */}
      <ellipse cx="100" cy="220" rx="38" ry="6" fill="rgba(255,255,255,0.25)"/>
      {/* Garnish */}
      {garnish === "lime" && (
        <g transform="translate(160,62)">
          <circle cx="0" cy="0" r="16" fill="#4A9D1A"/>
          <circle cx="0" cy="0" r="12" fill="#5CB825"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#4A9D1A" strokeWidth="1.2"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#4A9D1A" strokeWidth="1.2"/>
          <path d="M-8,-8 A12,12 0 0 1 8,-8" fill="none" stroke="#4A9D1A" strokeWidth="1"/>
        </g>
      )}
      {garnish === "orange" && (
        <g transform="translate(162,60)">
          <circle cx="0" cy="0" r="15" fill="#E07010"/>
          <circle cx="0" cy="0" r="11" fill="#F08820"/>
          <line x1="0" y1="-11" x2="0" y2="11" stroke="#E07010" strokeWidth="1.2"/>
          <line x1="-11" y1="0" x2="11" y2="0" stroke="#E07010" strokeWidth="1.2"/>
        </g>
      )}
    </svg>
  );
}

function GlassRocks({ fill, accent, ice, garnish }) {
  return (
    <svg viewBox="0 0 200 220" width="160" height="176">
      {/* Glass body */}
      <path d="M48,40 L38,195 L162,195 L152,40 Z" fill={`${fill}30`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Liquid */}
      <path d="M52,90 L42,193 L158,193 L148,90 Z" fill={`${fill}70`}/>
      {/* Ice cube */}
      {ice && <rect x="70" y="95" width="60" height="55" rx="6" fill="rgba(200,240,255,0.35)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>}
      {ice && <line x1="70" y1="115" x2="130" y2="115" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>}
      {ice && <line x1="95" y1="95" x2="95" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>}
      {/* Highlight */}
      <path d="M53,55 L56,130 L70,130 L68,55 Z" fill="rgba(255,255,255,0.08)"/>
      {/* Rim */}
      <line x1="48" y1="40" x2="152" y2="40" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
      {/* Base */}
      <ellipse cx="100" cy="195" rx="62" ry="8" fill="rgba(255,255,255,0.12)"/>
      {/* Orange garnish */}
      {garnish === "orange" && (
        <g transform="translate(155,55)">
          <path d="M-6,-18 Q6,-20 14,-8 Q20,4 10,14 Q-2,22 -14,12 Q-22,0 -16,-12 Z" fill="#E07010" opacity="0.9"/>
          <path d="M-6,-14 Q4,-16 10,-6 Q14,4 6,10 Q-2,18 -10,8 Q-16,0 -10,-10 Z" fill="#F09030" opacity="0.8"/>
        </g>
      )}
    </svg>
  );
}

function GlassHighball({ fill, accent, garnish }) {
  return (
    <svg viewBox="0 0 200 280" width="140" height="196">
      {/* Glass */}
      <path d="M58,22 L48,258 L152,258 L142,22 Z" fill={`${fill}28`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Liquid */}
      <path d="M62,80 L50,256 L150,256 L138,80 Z" fill={`${fill}65`}/>
      {/* Ice cubes */}
      <rect x="65" y="88" width="38" height="32" rx="4" fill="rgba(200,240,255,0.3)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
      <rect x="108" y="95" width="32" height="28" rx="4" fill="rgba(200,240,255,0.25)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      {/* Highlight */}
      <path d="M62,40 L65,180 L75,180 L73,40 Z" fill="rgba(255,255,255,0.07)"/>
      {/* Rim */}
      <line x1="58" y1="22" x2="142" y2="22" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
      {/* Base */}
      <ellipse cx="100" cy="258" rx="52" ry="7" fill="rgba(255,255,255,0.1)"/>
      {/* Mint garnish */}
      {garnish === "mint" && (
        <g transform="translate(88,30)">
          <ellipse cx="0" cy="0" rx="12" ry="7" fill="#2A8A20" style={{transform:"rotate(-30deg)"}}/>
          <ellipse cx="12" cy="-6" rx="10" ry="6" fill="#30A028" style={{transform:"rotate(-50deg)"}}/>
          <ellipse cx="-10" cy="-4" rx="10" ry="6" fill="#2A8A20" style={{transform:"rotate(-10deg)"}}/>
          <line x1="0" y1="0" x2="0" y2="22" stroke="#3A6018" strokeWidth="1.5"/>
        </g>
      )}
      {garnish === "lime" && (
        <g transform="translate(145,35)">
          <circle cx="0" cy="0" r="16" fill="#3A8A14"/>
          <circle cx="0" cy="0" r="12" fill="#4AA01C"/>
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#3A8A14" strokeWidth="1.2"/>
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#3A8A14" strokeWidth="1.2"/>
        </g>
      )}
    </svg>
  );
}

function GlassCoupe({ fill, accent, garnish }) {
  return (
    <svg viewBox="0 0 200 250" width="155" height="194">
      {/* Coupe bowl */}
      <path d="M30,48 Q30,130 100,148 Q170,130 170,48 Z" fill={`${fill}38`} stroke="rgba(255,255,255,0.42)" strokeWidth="1.5"/>
      {/* Liquid */}
      <path d="M42,60 Q40,128 100,146 Q160,128 158,60 Z" fill={`${fill}72`}/>
      {/* Highlight */}
      <path d="M36,55 Q34,90 48,112 L58,108 Q46,86 48,55 Z" fill="rgba(255,255,255,0.1)"/>
      {/* Rim */}
      <ellipse cx="100" cy="48" rx="70" ry="8" fill={`${fill}25`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Stem */}
      <line x1="100" y1="148" x2="100" y2="210" stroke="rgba(255,255,255,0.38)" strokeWidth="3"/>
      {/* Base */}
      <ellipse cx="100" cy="212" rx="40" ry="6" fill="rgba(255,255,255,0.22)"/>
      {/* Lime/lemon twist */}
      {garnish === "limetwist" && (
        <path d="M156,42 Q168,32 172,48 Q176,64 160,58" fill="none" stroke="#5CB825" strokeWidth="3" strokeLinecap="round" opacity="0.9"/>
      )}
      {garnish === "citron" && (
        <path d="M156,42 Q168,30 174,48 Q180,66 162,58" fill="none" stroke="#D4C020" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/>
      )}
    </svg>
  );
}

function GlassShot({ layers }) {
  return (
    <svg viewBox="0 0 200 220" width="100" height="110">
      <path d="M62,20 L52,190 L148,190 L138,20 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Layered fills */}
      {layers.map((col, i) => {
        const totalLayers = layers.length;
        const segH = 155 / totalLayers;
        const y = 30 + i * segH;
        const w1 = 76 + i * (10/totalLayers);
        const w2 = 76 + (i+1) * (10/totalLayers);
        return (
          <path key={i} d={`M${100-w1/2},${y} L${100-w2/2},${y+segH} L${100+w2/2},${y+segH} L${100+w1/2},${y} Z`}
            fill={col} opacity="0.85"/>
        );
      })}
      {/* Rim */}
      <line x1="62" y1="20" x2="138" y2="20" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
      <ellipse cx="100" cy="190" rx="48" ry="6" fill="rgba(255,255,255,0.1)"/>
    </svg>
  );
}

function GlassWine({ fill, accent }) {
  return (
    <svg viewBox="0 0 200 280" width="145" height="203">
      {/* Bowl */}
      <path d="M40,28 Q28,90 38,135 Q58,175 100,182 Q142,175 162,135 Q172,90 160,28 Z"
        fill={`${fill}30`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Liquid */}
      <path d="M46,80 Q36,120 44,148 Q62,180 100,185 Q138,180 156,148 Q164,120 154,80 Z" fill={`${fill}68`}/>
      {/* Highlight */}
      <path d="M44,40 Q38,75 42,110 L56,108 Q52,74 58,40 Z" fill="rgba(255,255,255,0.09)"/>
      {/* Rim */}
      <ellipse cx="100" cy="28" rx="60" ry="8" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill={`${fill}18`}/>
      {/* Stem */}
      <line x1="100" y1="182" x2="100" y2="244" stroke="rgba(255,255,255,0.35)" strokeWidth="3"/>
      {/* Base */}
      <ellipse cx="100" cy="246" rx="42" ry="6" fill="rgba(255,255,255,0.2)"/>
      {/* Orange garnish */}
      <g transform="translate(156,40)">
        <circle cx="0" cy="0" r="15" fill="#E07010" opacity="0.9"/>
        <circle cx="0" cy="0" r="11" fill="#F09030" opacity="0.85"/>
        <line x1="0" y1="-11" x2="0" y2="11" stroke="#E07010" strokeWidth="1.2"/>
        <line x1="-11" y1="0" x2="11" y2="0" stroke="#E07010" strokeWidth="1.2"/>
      </g>
    </svg>
  );
}

function GlassMug({ fill, accent }) {
  return (
    <svg viewBox="0 0 220 250" width="155" height="176">
      {/* Main mug body */}
      <path d="M38,35 L28,215 L158,215 L148,35 Z" fill={`${fill}32`} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      {/* Liquid */}
      <path d="M42,55 L32,213 L156,213 L146,55 Z" fill={`${fill}68`}/>
      {/* Handle */}
      <path d="M148,70 Q185,70 185,112 Q185,155 148,155" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="8" strokeLinecap="round"/>
      {/* Highlight */}
      <path d="M44,50 L47,160 L58,160 L56,50 Z" fill="rgba(255,255,255,0.08)"/>
      {/* Rim */}
      <line x1="38" y1="35" x2="148" y2="35" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
      {/* Base */}
      <ellipse cx="93" cy="215" rx="65" ry="9" fill="rgba(255,255,255,0.1)"/>
      {/* Ice */}
      <rect x="55" y="60" width="42" height="35" rx="5" fill="rgba(200,240,255,0.28)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
      {/* Lime */}
      <g transform="translate(148,48)">
        <circle cx="0" cy="0" r="14" fill="#3A8814"/>
        <circle cx="0" cy="0" r="10" fill="#4AA01C"/>
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#3A8814" strokeWidth="1.2"/>
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#3A8814" strokeWidth="1.2"/>
      </g>
    </svg>
  );
}

// ─── Glass illustrations per cocktail ────────────────────────────────────
function IlluMargarita()    { return <GlassMartini fill="#52B788" accent="#74C69D" rim={true} garnish="lime" />; }
function IlluNegroni()      { return <GlassRocks    fill="#E74C3C" accent="#FF6B6B" ice={true}  garnish="orange" />; }
function IlluMoscowMule()   { return <GlassMug      fill="#D2691E" accent="#E8A87C" />; }
function IlluMojito()       { return <GlassHighball fill="#40916C" accent="#74C69D" garnish="mint" />; }
function IlluCosmopolitan() { return <GlassMartini  fill="#E91E8C" accent="#F48FB1" rim={false} garnish="orange" />; }
function IlluOldFashioned() { return <GlassRocks    fill="#B8860B" accent="#DAA520" ice={true}  garnish="orange" />; }
function IlluLastWord()     { return <GlassCoupe    fill="#84A000" accent="#A8D500" garnish="limetwist" />; }
function IlluPaperPlane()   { return <GlassCoupe    fill="#E8A000" accent="#FFB830" garnish="citron" />; }
function IlluSpritz()       { return <GlassWine     fill="#FF7043" accent="#FFAB91" />; }
function IlluGimlet()       { return <GlassCoupe    fill="#2ECC71" accent="#52E08A" garnish="limetwist" />; }
function IlluTequilaSunrise(){ return <GlassHighball fill="#FFA000" accent="#FFD54F" garnish="lime" />; }
function IlluB52()          { return <GlassShot layers={["#3D1A00","#D2B48C","#E8642A"]} />; }

const COCKTAIL_GLASSES = {
  "margarita":      IlluMargarita,
  "negroni":        IlluNegroni,
  "moscow-mule":    IlluMoscowMule,
  "mojito":         IlluMojito,
  "cosmopolitan":   IlluCosmopolitan,
  "old-fashioned":  IlluOldFashioned,
  "last-word":      IlluLastWord,
  "paper-plane":    IlluPaperPlane,
  "spritz":         IlluSpritz,
  "gimlet":         IlluGimlet,
  "tequila-sunrise":IlluTequilaSunrise,
  "b52":            IlluB52,
};

Object.assign(window, { COCKTAIL_SCENES, COCKTAIL_GLASSES });
