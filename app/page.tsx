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

  const handleApply = () => {
    setIsApplying(true);
    // Simulación de proceso de sistema
    setTimeout(() => {
      alert("Para aplicar: Mantén pulsada la imagen y selecciona 'Guardar' o 'Establecer como fondo'");
      setIsApplying(false);
    }, 1500);
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
      
      {/* HEADER FLOTANTE */}
      <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: isApplying ? 'none' : 'block' }}>
        <header style={{ 
          padding: '12px 24px', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(30px) saturate(160%)',
          WebkitBackdropFilter: 'blur(30px) saturate(160%)', borderRadius: '24px', border: '0.5px solid rgba(255,255,255,0.15)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
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
            background: isApplying ? '#000' : 'rgba(0,0,0,0.92)', 
            backdropFilter: isApplying ? 'none' : 'blur(25px)',
            transition: 'all 0.5s ease'
          }}>
            
            {!isApplying && (
              <button 
                onClick={() => setSelectedWallpaper(null)}
                style={{ position: 'absolute', top: '40px', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', zIndex: 2001 }}
              >✕</button>
            )}

            <div style={{ 
              width: isApplying ? '100vw' : '85%', 
              height: isApplying ? '100vh' : 'auto',
              maxWidth: isApplying ? '100%' : '350px',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative'
            }}>
              <img 
                src={selectedWallpaper.irl} 
                style={{ 
                  width: '100%', 
                  height: isApplying ? '100vh' : 'auto',
                  borderRadius: isApplying ? '0px' : '40px', 
                  objectFit: 'cover',
                  boxShadow: isApplying ? 'none' : '0 40px 80px rgba(0,0,0,0.9)',
                  border: isApplying ? 'none' : '0.5px solid rgba(255,255,255,0.3)' 
                }} 
              />
              
              {!isApplying && (
                <div style={{ marginTop: '30px', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#fff', marginBottom: '20px' }}>{selectedWallpaper.name}</h2>
                  
                  <button 
                    onClick={handleApply}
                    style={{
                      width: '100%', padding: '20px', borderRadius: '25px',
                      background: '#fff', color: '#000', border: 'none', 
                      fontSize: '15px', fontWeight: '900', cursor: 'pointer'
                    }}
                  >
                    APPLY WALLPAPER
                  </button>
                </div>
              )}

              {isApplying && (
                <div style={{ 
                  position: 'absolute', bottom: '50px', left: '0', width: '100%', 
                  display: 'flex', justifyContent: 'center', animation: 'fadeIn 1s' 
                }}>
                  <div style={{ 
                    padding: '15px 30px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)',
                    borderRadius: '20px', border: '0.5px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '12px'
                  }}>
                    Setting up Liquid Glass...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          body { background-color: #000; margin: 0; overflow: ${selectedWallpaper ? 'hidden' : 'auto'}; }
        `}</style>
      </main>
    </div>
  );
}