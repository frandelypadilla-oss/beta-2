'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

interface Wallpaper {
  id: number;
  name: string;
  irl: string;
}

export default function HomePage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const { data } = await supabase.from('wallpapers').select('*');
        if (data) setWallpapers(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchWallpapers();
  }, []);

  // FUNCIÓN MÁGICA: ABRE EL MENÚ NATIVO PARA INSTALAR COMO FONDO
  const applyDirectly = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], `${name}.png`, { type: 'image/png' });

      // Verificamos si el dispositivo soporta compartir archivos (La mayoría de móviles modernos)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'iVibe PRO',
          text: `Apply ${name} as wallpaper`,
        });
      } else {
        // Si no soporta share, hacemos descarga automática como plan B
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.png`;
        link.click();
        alert("Tu dispositivo no permite aplicar directamente. Se ha descargado a tu galería.");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Hubo un problema. Intenta mantener presionada la imagen.");
    }
  };

  if (loading) return (
    <div style={{background:'#000', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      <div style={{padding:'40px', background:'rgba(255,255,255,0.03)', borderRadius:'40px', backdropFilter:'blur(40px)', color: '#fff', fontSize: '24px', fontWeight: '900'}}>
        iVibe PRO
      </div>
    </div>
  );

  return (
    <div style={{ background: '#000', minHeight: '100vh', display: 'flex', justifyContent: 'center', overflowX: 'hidden' }}>
      
      {/* BANNER FLOTANTE */}
      <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <header style={{ 
          padding: '12px 24px', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)', borderRadius: '24px', border: '0.5px solid rgba(255,255,255,0.15)',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1.2px', margin: 0, color: '#fff' }}>iVibe</h1>
          <div style={{ fontSize: '8px', fontWeight: '900', color: '#007AFF', letterSpacing: '1.5px', marginTop: '-2px' }}>PRO</div>
        </header>
      </div>

      <main style={{ width: '100%', maxWidth: '430px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{ height: '120px' }} />

        {/* GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', padding: '0 15px 120px' }}>
          {wallpapers.map((wp) => (
            <div 
              key={wp.id} 
              onClick={() => setSelectedWallpaper(wp)}
              style={{ position: 'relative', borderRadius: '32px', overflow: 'hidden', height: '320px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
            >
              <img src={wp.irl} alt={wp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* --- MODAL DE PREVIEW & APLICAR --- */}
        {selectedWallpaper && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(30px)'
          }}>
            
            <button 
              onClick={() => setSelectedWallpaper(null)}
              style={{ position: 'absolute', top: '40px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer' }}
            >✕</button>

            <div style={{ width: '85%', maxWidth: '360px', textAlign: 'center' }}>
              <img 
                src={selectedWallpaper.irl} 
                style={{ width: '100%', borderRadius: '40px', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', border: '0.5px solid rgba(255,255,255,0.2)' }} 
              />
              
              <div style={{ marginTop: '30px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '25px' }}>{selectedWallpaper.name}</h2>
                
                <button 
                  onClick={() => applyDirectly(selectedWallpaper.irl, selectedWallpaper.name)}
                  style={{
                    width: '100%', padding: '22px', borderRadius: '25px',
                    background: '#fff', color: '#000', border: 'none', 
                    fontSize: '16px', fontWeight: '900', cursor: 'pointer',
                    boxShadow: '0 10px 20px rgba(255,255,255,0.1)'
                  }}
                >
                  SET AS WALLPAPER
                </button>
                <p style={{ marginTop: '15px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  Opens system settings to apply image
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        body { background-color: #000; margin: 0; overflow: ${selectedWallpaper ? 'hidden' : 'auto'}; }
      `}</style>
    </div>
  );
}