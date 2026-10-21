'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerifyPage() {
  const [passportId, setPassportId] = useState('')

  return (
    <div className="monopo-animated-bg min-h-screen text-white flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* HEADER DE VERIFICACIÓN */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <Link href="/" className="passport-brand-badge flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-white">Passport</span>
          <span className="text-xs font-semibold text-amber-300">LATAM</span>
        </Link>
        <Link href="/" className="text-xs font-mono text-white/70 hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="text-center max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2">Verifica un producto</h1>
          <p className="text-xs text-white/70 mb-8 leading-relaxed">
            Ingresa el ID del pasaporte digital o escanea el código QR para consultar su autenticidad e historial en la red Stellar.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); if (passportId) window.location.href = `/passport/${passportId}` }} className="space-y-4">
            <div>
              <label className="block text-left text-[11px] font-mono text-white/60 mb-2 uppercase tracking-wider">
                ID del pasaporte
              </label>
              <input
                type="text"
                placeholder="Ej: pass_123456789"
                value={passportId}
                onChange={(e) => setPassportId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-[1.02] transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Verificar en Stellar
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs font-mono text-white/40 border-t border-white/10 bg-black/40">
        Passport LATAM • Verified on Stellar
      </footer>

    </div>
  )
}