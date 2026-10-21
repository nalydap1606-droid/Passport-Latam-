'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient()

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/dashboard')
      else setCheckingSession(false)
    })
  }, [router])

  if (checkingSession) return (
    <div className="flex-1 flex items-center justify-center min-h-screen monopo-animated-bg text-white">
      <span className="loading loading-spinner loading-sm text-white" />
    </div>
  )

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.replace('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de autenticación')
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleAuth = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error con Google Sign In')
      setSubmitting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      alert('Revisa tu correo para confirmar el registro')
      setIsRegistering(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de registro')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="monopo-animated-bg min-h-screen text-white flex flex-col justify-between selection:bg-white selection:text-black">
      
      {/* HEADER MONOPO */}
      <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <Link href="/" className="passport-brand-badge flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-white">Passport</span>
          <span className="text-xs font-semibold text-amber-300">LATAM</span>
        </Link>
        <Link href="/" className="text-xs font-mono text-white/70 hover:text-white transition-colors">
          ← Volver al inicio
        </Link>
      </header>

      {/* CONTENIDO DE ACCESO CON CRISTALERÍA */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 my-8">
        <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up">
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">
              {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </h1>
            <p className="text-xs text-white/70 mt-1">
              {isRegistering ? 'Regístrate como empresa emisora' : 'Accede a tu panel de emisión'}
            </p>
          </div>

          {/* BOTÓN GOOGLE */}
          <button
            onClick={handleGoogleAuth}
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all text-xs font-mono flex items-center justify-center gap-3 disabled:opacity-50 mb-6"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {submitting ? 'Procesando...' : 'Continuar con Google'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] uppercase font-mono text-white/40">o con email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* FORMULARIO DE CORREO Y CONTRASEÑA */}
          <form onSubmit={isRegistering ? handleRegister : handleEmailAuth} className="flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Correo electrónico</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white font-mono"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white font-mono"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-[1.01] transition-all text-sm shadow-lg mt-2 disabled:opacity-50"
            >
              {submitting ? 'Procesando...' : isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 font-mono">
              {error}
            </div>
          )}

          <p className="text-center text-xs text-white/70 mt-6 font-mono">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}{' '}
            <button
              onClick={() => { setIsRegistering(!isRegistering); setError(null) }}
              className="font-semibold text-amber-300 hover:underline underline-offset-2 ml-1"
            >
              {isRegistering ? 'Inicia sesión' : 'Regístrate'}
            </button>
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs font-mono text-white/40 border-t border-white/10 bg-black/40">
        Passport LATAM • Auth Infrastructure
      </footer>

    </div>
  )
}