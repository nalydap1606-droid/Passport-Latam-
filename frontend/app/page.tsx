'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [showWidget, setShowWidget] = useState(false)

  return (
    <div className="monopo-animated-bg flex-1 flex flex-col text-white selection:bg-white selection:text-black">

      {/* ─── HEADER LIMPIO Y CENTRADO PERFECTO ─── */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
        
        {/* Lado Izquierdo: Brand Badge */}
        <div className="flex items-center">
          <Link href="/" className="passport-brand-badge flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">Passport</span>
            <span className="text-xs font-semibold text-amber-300">LATAM</span>
          </Link>
        </div>

        {/* Centro: Enlaces de Navegación perfectamente alineados */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider text-white/80 absolute left-1/2 -translate-x-1/2">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <Link href="/verify" className="hover:text-white transition-colors">Verificar producto</Link>
          <Link href="/login" className="hover:text-white transition-colors">Empresas</Link>
        </nav>

        {/* Lado Derecho: Botones de Acción */}
        <div className="flex items-center gap-3">
          <Link href="/verify" className="px-4 py-2 text-xs font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verificar un producto
          </Link>
          <Link href="/login" className="px-4 py-2 text-xs font-medium rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all">
            Registrar mi producto
          </Link>
        </div>
      </header>

      {/* ─── VISTA 1: HERO ─── */}
      <section className="relative min-h-[78vh] flex flex-col justify-center overflow-hidden px-4">
        <div className="relative z-10 text-center max-w-4xl mx-auto pt-8">
          
          {/* Badges centrados */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono uppercase tracking-widest">
              Nalytrace
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-mono uppercase tracking-widest">
              Stellar Soroban
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight drop-shadow-md">
            Pasaporte Digital
            <br />
            <span className="text-white/70 font-serif italic">para Productos Latinos</span>
          </h1>

          <p className="mt-6 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            De la trazabilidad a la confianza. Registra tus productos en Stellar y
            ofrece a tus clientes una verificación inmutable de origen y autenticidad.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-105 transition-all shadow-xl inline-flex items-center justify-center gap-2"
            >
              Registrar mi producto →
            </Link>
            <Link
              href="/verify"
              className="px-8 py-3.5 border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verificar un producto
            </Link>
          </div>

          <p className="mt-10 text-xs text-white/50 font-mono tracking-wider">
            From Origin to Ownership, Verified on Stellar.
          </p>
        </div>

        {/* CÍRCULO / CÁPSULA ESTILIZADA DE SCROLL RESTAURADA */}
        <div className="mt-10 flex justify-center relative z-10">
          <div className="w-5 h-9 rounded-full border border-white/30 flex items-start justify-center p-1 bg-black/20 backdrop-blur-sm">
            <div className="w-1 h-3 rounded-full bg-white/90 dot-bounce" />
          </div>
        </div>
      </section>

      {/* ─── ESTADÍSTICAS ─── */}
      <section className="relative z-20 px-4 max-w-5xl mx-auto w-full -mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 glass-panel p-6 rounded-2xl text-center">
          {[
            { number: '100%', label: 'On-chain' },
            { number: '0.001', label: 'XLM por emisión' },
            { number: '3s', label: 'Confirmación' },
            { number: '∞', label: 'Inmutable' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-2xl md:text-3xl font-bold">{s.number}</p>
              <p className="text-xs text-white/60 mt-1 uppercase font-mono">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VISTA 2: ¿CÓMO FUNCIONA? ─── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Proceso</span>
            <h2 className="text-3xl font-bold mt-2">¿Cómo funciona?</h2>
            <p className="text-white/70 text-sm mt-2">Tres pasos simples para llevar tus productos a Stellar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                title: 'Registra',
                desc: 'Completa los datos de tu producto y conecta tu wallet Stellar. El hash de integridad se genera automáticamente.',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                )
              },
              {
                step: '02',
                title: 'Emite',
                desc: 'Firma la transacción con tu wallet. El contrato Soroban genera un pasaporte digital único en la blockchain de Stellar.',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                )
              },
              {
                step: '03',
                title: 'Verifica',
                desc: 'Imprime el QR en tu producto. Cualquier persona lo escanea y verifica la autenticidad en Stellar al instante.',
                icon: (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                )
              }
            ].map((s, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <span className="text-xs font-mono text-white/50 mb-1">{s.step}</span>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-xs text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISTA 3: CASOS DE USO REALES ─── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Aplicaciones</span>
            <h2 className="text-3xl font-bold mt-2">Casos de uso reales</h2>
            <p className="text-white/70 text-sm mt-2">Productos latinoamericanos que ya transforman su trazabilidad con Stellar.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Alpaca Boliviana', tags: ['Textiles', 'Comercio Justo'], desc: 'Trazabilidad desde la fibra hasta la prenda. Certifica origen ético y calidad en cada etapa.' },
              { title: 'Café Colombiano', tags: ['Alimentos', 'Origen'], desc: 'Verifica el origen exacto, la finca productora y el proceso de tostado. Conecta al consumidor.' },
              { title: 'Artesanías Mexicanas', tags: ['Cultura', 'Autenticidad'], desc: 'Protege la autenticidad cultural de las artesanías. Combate la falsificación con un registro on-chain.' }
            ].map((c, i) => (
              <div key={i} className="glass-panel glass-panel-hover p-6 rounded-2xl cursor-pointer">
                <h3 className="text-lg font-bold mb-2">{c.title}</h3>
                <div className="flex gap-2 mb-3">
                  {c.tags.map(t => <span key={t} className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full">{t}</span>)}
                </div>
                <p className="text-xs text-white/70 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── VISTA 4: TECNOLOGÍA ─── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-white/50 uppercase tracking-widest">Tecnología</span>
            <h2 className="text-3xl font-bold mt-2">¿Por qué en Stellar?</h2>
            <p className="text-white/70 text-sm mt-2">La blockchain de Stellar ofrece la velocidad, el costo y la confianza que América Latina necesita.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🚀', title: 'Costo casi cero', desc: 'Cada emisión cuesta fracciones de un centavo de dólar. Sin gas fees ni subastas de bloques.' },
              { icon: '⚡', title: 'Confirmación en segundos', desc: 'Stellar confirma transacciones en 3-5 segundos. Ideal para verificación en punto de venta.' },
              { icon: '🔒', title: 'Inmutabilidad real', desc: 'Una vez emitido, el pasaporte no puede ser alterado. Ni siquiera nosotros podemos modificarlo.' },
              { icon: '👁️', title: 'Transparencia pública', desc: 'Cualquier persona puede verificar un pasaporte sin necesidad de cuenta ni permiso.' }
            ].map((f, i) => (
              <div key={i} className="glass-panel p-5 rounded-xl flex gap-4 items-start">
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-xs text-white/70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-white/50">
            <span>STELLAR SOROBAN</span> • <span>FREIGHTER</span> • <span>STELLAR WALLETS KIT</span> • <span>SUPABASE</span> • <span>SEP-1 · SEP-10</span>
          </div>
        </div>
      </section>

      {/* ─── VISTA 5: EMITIR PASAPORTE ─── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center glass-panel p-10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">¿Listo para emitir tu primer pasaporte?</h2>
          <p className="text-white/70 text-sm mb-8">
            Registra tu empresa, conecta tu wallet y emite pasaportes digitales verificables en Stellar. Sin costo de entrada.
          </p>
          <Link 
            href="/login" 
            className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-105 hover:shadow-2xl transition-all inline-block"
          >
            Comenzar ahora →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black/50 text-xs font-mono">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-sans text-white/90">¿Tienes dudas sobre cómo integrar Soroban o emitir pasaportes a escala?</p>
            <a href="mailto:hola@passportlatam.com" className="inline-block text-white underline hover:text-white/80 transition-colors">
              hola@passportlatam.com →
            </a>
          </div>

          <div className="text-center md:text-right text-white/50 space-y-1">
            <p className="text-white font-bold font-sans">Passport LATAM</p>
            <p>From Origin to Ownership, Verified on Stellar.</p>
          </div>
        </div>
      </footer>

      {/* ─── BOTÓN FLOTANTE "N" ─── */}
      <button 
        onClick={() => setShowWidget(!showWidget)} 
        className="naly-n-btn font-sans font-black text-xl text-white tracking-tighter"
        title="Nalytrace Info"
      >
        N
      </button>

      {/* VENTANA EMERGENTE DE LA N */}
      {showWidget && (
        <div className="fixed bottom-20 left-6 z-50 glass-panel p-6 rounded-2xl max-w-xs shadow-2xl border border-white/30">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-sm tracking-wider">NALYTRACE</span>
            <button onClick={() => setShowWidget(false)} className="text-white/50 hover:text-white">✕</button>
          </div>
          <p className="text-xs text-white/80 leading-relaxed">
            Infraestructura de identidad digital y trazabilidad sobre la red Stellar.
          </p>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[10px] font-mono text-white/50">
            <span>STATUS: ONLINE</span>
            <span>VER. 2026</span>
          </div>
        </div>
      )}

    </div>
  )
}