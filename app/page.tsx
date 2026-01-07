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
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        const { data } = await supabase.from('wallpapers').select('*');
        if (data) setWallpapers(data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchWallpapers();
  }, []);

  // FUNCIÓN DE DESCARGA REAL PARA LA APK
  const downloadImage = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${name}-ivibe.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert("Error al descargar. Mantén presionada la imagen para guardar.");
    }
  };

  const handleApply = () => {
    setIsApplying(true);
    // Simulación de inmersión total
    setTimeout(() => {
      alert("VISTA PREVIA ACTIVA: Mantén pulsado para establecer como fondo o guarda la imagen primero.");
      setIsApplying(false);
    }, 3000);
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
      
      {/* HEADER FLOTANTE (Se oculta al aplicar) */}
      {!isApplying && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <header style={{ 
            padding: '12px 24px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px) saturate(160%)',
            WebkitBackdropFilter: 'blur(30px) saturate(160%)', borderRadius: '24px', border: '0.5px solid rgba(255,255,255,0.15)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-1.2px', margin: 0, color: '#fff' }}>iVibe</h1>
            <div style={{ fontSize: '8px', fontWeight: '900', color: '#007AFF', letterSpacing: '1.5px', marginTop: '-2px' }}>PRO</div>
          </header>
        </div>
      )}

      <main style={{ width: '100%', maxWidth: '430px', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <div style={{ height: '120px' }} />

        {/* GRID DE WALLPAPERS */}
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

        {/* --- MODAL DE PREVIEW & ACCIONES --- */}
        {selectedWallpaper && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: isApplying ? '#000' : 'rgba(0,0,0,0.95)', 
            backdropFilter: isApplying ? 'none' : 'blur(30px)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            
            {/* BOTÓN CERRAR */}
            {!isApplying && (
              <button 
                onClick={() => setSelectedWallpaper(null)}
                style={{ position: 'absolute', top: '40px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', zIndex: 2001, fontSize: '20px' }}
              >✕</button>
            )}

            <div style={{ 
              width: isApplying ? '100vw' : '85%', 
              height: isApplying ? '100vh' : 'auto',
              maxWidth: isApplying ? '100%' : '380px',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}>
              <img 
                src={selectedWallpaper.irl} 
                style={{ 
                  width: '100%', 
                  height: isApplying ? '100vh' : 'auto',
                  borderRadius: isApplying ? '0px' : '44px', 
                  objectFit: 'cover',
                  boxShadow: isApplying ? 'none' : '0 40px 100px rgba(0,0,0,0.8)',
                  border: isApplying ? 'none' : '0.5px solid rgba(255,255,255,0.2)' 
                }} 
              />
              
              {/* BOTONES DE ACCIÓN (Solo visibles si no está en modo inmersivo) */}
              {!isApplying && (
                <div style={{ marginTop: '25px', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', animation: 'fadeIn 0.5s' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', margin: '0 0 10px' }}>{selectedWallpaper.name}</h2>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => downloadImage(selectedWallpaper.irl, selectedWallpaper.name)}
                      style={{
                        flex: 1, padding: '18px', borderRadius: '20px',
                        background: 'rgba(255,255,255,0.1)', color: '#fff', border: '0.5px solid rgba(255,255,255,0.2)', 
                        fontSize: '14px', fontWeight: '700', cursor: 'pointer', backdropFilter: 'blur(10px)'
                      }}
                    >
                      💾 SAVE
                    </button>
                    <button 
                      onClick={handleApply}
                      style={{
                        flex: 2, padding: '18px', borderRadius: '20px',
                        background: '#fff', color: '#000', border: 'none', 
                        fontSize: '14px', fontWeight: '900', cursor: 'pointer'
                      }}
                    >
                      APPLY NOW
                    </button>
                  </div>
                </div>
              )}

              {/* BARRA DE ESTADO AL APLICAR */}
              {isApplying && (
                <div style={{ 
                  position: 'absolute', top: '60px', left: '0', width: '100%', 
                  display: 'flex', justifyContent: 'center', animation: 'fadeIn 0.5s' 
                }}>
                  <div style={{ 
                    padding: '10px 20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
                    borderRadius: '40px', border: '0.5px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: '11px', fontWeight: '700'
                  }}>
                    FULLSCREEN PREVIEW
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          body { background-color: #000; margin: 0; padding: 0; overflow: ${selectedWallpaper ? 'hidden' : 'auto'}; }
        `}</style>
      </main>
    </div>
  );
}