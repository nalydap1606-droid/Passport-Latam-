'use client'

import { Suspense, useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabaseAuth } from '@/app/hooks/useSupabaseAuth'
import { useWallet } from '@/app/hooks/useWallet'
import { usePassportContract } from '@/app/hooks/usePassportContract'
import { useQR } from '@/app/hooks/useQR'
import { computeMetadataHash } from '@/app/lib/hash'
import { isCertifiedIssuer } from '@/app/lib/soroban'
import { WalletButton } from '@/app/components/WalletButton'
import { PassportQR } from '@/app/components/PassportQR'
import { TxStatus } from '@/app/components/TxStatus'
import Link from 'next/link'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const CATEGORIES = ['textile', 'coffee', 'ceramic', 'cosmetic', 'food', 'art', 'other']

export default function EmitPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-screen monopo-animated-bg"><span className="loading loading-spinner loading-sm text-white" /></div>}>
      <EmitForm />
    </Suspense>
  )
}

function EmitForm() {
  const router = useRouter()
  const { user, supabase, getCompany, loading: authLoading } = useSupabaseAuth()
  const wallet = useWallet()
  const contract = usePassportContract()
  const qr = useQR()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  const searchParams = useSearchParams()
  const editProductId = searchParams.get('productId')

  const [step, setStep] = useState<'loading' | 'company' | 'form' | 'result'>('loading')
  const [company, setCompany] = useState<any>(null)
  const [companyForm, setCompanyForm] = useState({ name: '', country: '', sector: '', description: '', stellar_address: '' })
  const [submittingCompany, setSubmittingCompany] = useState(false)
  const [companySuccess, setCompanySuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    materials: '',
    originCity: '',
    originCountry: '',
    category: '',
    year: new Date().getFullYear(),
    certifications: '[]',
  })
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [txStatus, setTxStatus] = useState<'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error'>('idle')
  const [txMessage, setTxMessage] = useState<string | null>(null)
  const [passportId, setPassportId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isIssuer, setIsIssuer] = useState<boolean | null>(null)

  useEffect(() => {
    if (user) getCompany().then(c => { setCompany(c); setStep(c ? 'form' : 'company') })
  }, [user, getCompany])

  useEffect(() => {
    if (!editProductId || !supabase) return
    supabase.from('products').select('*').eq('id', editProductId).single().then(({ data, error }) => {
      if (data && !error) {
        setForm({
          name: data.name,
          description: data.description || '',
          materials: Array.isArray(data.materials) ? data.materials.join(', ') : '',
          originCity: data.origin_city || '',
          originCountry: data.origin_country || '',
          category: data.category || '',
          year: data.year || new Date().getFullYear(),
          certifications: JSON.stringify(data.certifications || []),
        })
        if (data.images?.length) setExistingImages(data.images)
      }
    })
  }, [editProductId, supabase])

  useEffect(() => {
    if (companySuccess) {
      const t = setTimeout(() => { setStep('form'); setCompanySuccess(false) }, 1200)
      return () => clearTimeout(t)
    }
  }, [companySuccess])

  useEffect(() => {
    if (wallet.isConnected && wallet.address) {
      isCertifiedIssuer(wallet.address).then(setIsIssuer).catch(() => setIsIssuer(null))
    } else {
      setIsIssuer(null)
    }
  }, [wallet.isConnected, wallet.address])

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmittingCompany(true)
    setError(null)
    try {
      const { data, error } = await supabase.from('companies').insert({
        user_id: user!.id,
        name: companyForm.name,
        country: companyForm.country,
        sector: companyForm.sector,
        description: companyForm.description,
        stellar_address: companyForm.stellar_address || null,
      }).select().single()

      if (error) throw new Error(error.message)
      setCompany(data)
      setCompanySuccess(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error creando la empresa')
    }
    setSubmittingCompany(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    if (!e.target.files) return
    const oversized = Array.from(e.target.files).filter(f => f.size > MAX_FILE_SIZE)
    if (oversized.length > 0) {
      setFileError(`"${oversized[0].name}" supera el límite de 5 MB`)
      e.target.value = ''
      return
    }
    setImages(Array.from(e.target.files))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setFileError(null)

    if (!wallet.isConnected) {
      setError('Conecta tu wallet Stellar primero')
      return
    }
    if (isIssuer === false) {
      setError('Tu wallet no está certificada como issuer. Contacta al admin del contrato.')
      return
    }

    setTxStatus('building')
    setTxMessage('Preparando datos del producto...')

    try {
      const imageUrls: string[] = [...existingImages]
      if (images.length > 0) {
        setTxMessage('Subiendo imágenes...')
        for (const img of images) {
          const path = `${company.id}/${Date.now()}-${img.name}`
          const { error: upErr } = await supabase.storage.from('product-images').upload(path, img)
          if (upErr) {
            if (upErr.message.includes('row-level security')) {
              throw new Error('No tienes permiso para subir imágenes. Verifica que hayas iniciado sesión.')
            }
            if (upErr.message.includes('Request too large') || upErr.message.includes('Payload too large')) {
              throw new Error('La imagen es demasiado grande. El máximo es 5 MB por archivo.')
            }
            throw new Error('Error al subir imagen: ' + upErr.message)
          }
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
          imageUrls.push(publicUrl)
        }
      }

      let certifications: any[] = []
      try { certifications = JSON.parse(form.certifications) } catch {}

      const productData = {
        name: form.name,
        description: form.description,
        materials: form.materials.split(',').map(m => m.trim()).filter(Boolean),
        origin_city: form.originCity,
        origin_country: form.originCountry,
        category: form.category,
        certifications,
        year: form.year,
      }
      const metadataHash = await computeMetadataHash(productData)

      let productId: string
      if (editProductId) {
        setTxMessage('Actualizando producto...')
        const imageUpdate: any = {}
        if (imageUrls.length > 0) imageUpdate.images = imageUrls
        const { error: updErr } = await supabase
          .from('products')
          .update({
            name: form.name,
            description: form.description,
            materials: form.materials.split(',').map(m => m.trim()).filter(Boolean),
            origin_city: form.originCity,
            origin_country: form.originCountry,
            category: form.category,
            certifications,
            year: form.year,
            metadata_hash: metadataHash,
            ...imageUpdate,
          })
          .eq('id', editProductId)
        if (updErr) throw new Error('Error al actualizar producto: ' + updErr.message)
        productId = editProductId
      } else {
        setTxMessage('Guardando producto...')
        const { data: product, error: prodErr } = await supabase
          .from('products')
          .insert({
            company_id: company.id,
            name: form.name,
            description: form.description,
            materials: form.materials.split(',').map(m => m.trim()).filter(Boolean),
            origin_city: form.originCity,
            origin_country: form.originCountry,
            category: form.category,
            certifications,
            year: form.year,
            images: imageUrls,
            metadata_hash: metadataHash,
          })
          .select('id')
          .single()
        if (prodErr) throw new Error('Error al guardar producto: ' + prodErr.message)
        productId = product.id
      }

      if (!editProductId) {
        setTxMessage('Verificando si el producto ya tiene pasaporte...')
        const { data: sameNameProducts } = await supabase
          .from('products')
          .select('id')
          .eq('company_id', company.id)
          .eq('name', form.name)
        if (sameNameProducts && sameNameProducts.length > 0) {
          const { data: existingPassports } = await supabase
            .from('passports')
            .select('passport_id')
            .in('product_id', sameNameProducts.map(p => p.id))
            .limit(1)
          if (existingPassports && existingPassports.length > 0) {
            throw new Error('Este producto ya tiene un pasaporte emitido. Revisa tu dashboard.')
          }
        }
      }

      setTxStatus('signing')
      setTxMessage('Firma la transacción en tu wallet...')

      const result = await contract.emit({
        issuer: wallet.address!,
        productId,
        metadataHash,
        owner: wallet.address!,
        category: form.category,
        originCountry: form.originCountry,
      }, async (xdr: string) => {
        setTxStatus('signing')
        return wallet.sign(xdr, contract.networkPassphrase)
      })

      setTxStatus('submitting')
      setTxMessage('Guardando pasaporte...')

      const pid = result.result as string
      setPassportId(pid)

      const { error: passErr } = await supabase
        .from('passports')
        .insert({
          product_id: productId,
          company_id: company.id,
          passport_id: pid,
          metadata_hash: metadataHash,
          issuer_address: wallet.address,
          owner_address: wallet.address,
          tx_hash: result.hash,
          qr_url: `${process.env.NEXT_PUBLIC_APP_URL}/verify/${pid}`,
        })

      if (passErr) throw new Error('Error al guardar pasaporte: ' + passErr.message)

      await supabase.from('traceability_events').insert({
        passport_id: pid,
        event_type: 'emitted',
        to_address: wallet.address,
        tx_hash: result.hash,
      })

      setTxStatus('success')
      setTxMessage('¡Pasaporte emitido exitosamente!')
      setStep('result')
    } catch (e) {
      setTxStatus('error')
      const msg = e instanceof Error ? e.message : 'Error al emitir pasaporte'
      if (msg.includes('Contract, #4')) {
        setError('Tu wallet no está autorizada para emitir pasaportes. El admin del contrato debe certificarla como issuer.')
      } else if (msg.includes('HostError') || msg.includes('ContractError')) {
        setError('El contrato rechazó la transacción. Revisa que tu wallet esté certificada como issuer.')
      } else {
        setError(msg)
      }
    }
  }

  // --- Header Común Monopo ---
  const renderHeader = () => (
    <header className="w-full px-6 md:px-12 py-5 flex items-center justify-between relative z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <Link href="/" className="passport-brand-badge flex items-center gap-2">
        <span className="font-bold text-sm tracking-tight text-white">Passport</span>
        <span className="text-xs font-semibold text-amber-300">LATAM</span>
      </Link>
      <Link href="/" className="text-xs font-mono text-white/70 hover:text-white transition-colors">
        ← Volver al inicio
      </Link>
    </header>
  )

  // --- Loading ---
  if (step === 'loading') return (
    <div className="min-h-screen monopo-animated-bg text-white flex flex-col justify-between">
      {renderHeader()}
      <div className="flex-1 flex items-center justify-center">
        <span className="loading loading-spinner loading-sm text-white" />
      </div>
    </div>
  )

  // --- Company success ---
  if (companySuccess) return (
    <div className="min-h-screen monopo-animated-bg text-white flex flex-col justify-between">
      {renderHeader()}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center glass-panel p-8 rounded-3xl animate-fade-in-up max-w-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4 border border-white/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-lg font-bold">Perfil creado</h2>
          <p className="text-xs text-white/60 mt-1">Redirigiendo al formulario de emisión...</p>
        </div>
      </div>
    </div>
  )

  // --- Company form ---
  if (step === 'company') {
    const canSubmit = companyForm.name.trim() && companyForm.country.trim() && companyForm.sector.trim()

    return (
      <div className="min-h-screen monopo-animated-bg text-white flex flex-col justify-between">
        {renderHeader()}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold">Perfil de empresa</h2>
              <p className="text-xs text-white/70 mt-1">Completa los datos para empezar a emitir pasaportes</p>
            </div>

            <form onSubmit={handleCreateCompany} className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Nombre de la empresa *</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={companyForm.name} onChange={e => setCompanyForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Tejidos Andinos SRL" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">País *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={companyForm.country} onChange={e => setCompanyForm(f => ({ ...f, country: e.target.value }))} placeholder="BO" required />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Sector *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={companyForm.sector} onChange={e => setCompanyForm(f => ({ ...f, sector: e.target.value }))} required>
                    <option value="" className="bg-neutral-900">Seleccionar</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Descripción</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={companyForm.description} onChange={e => setCompanyForm(f => ({ ...f, description: e.target.value }))} placeholder="Cuéntanos sobre tu empresa..." />
              </div>

              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Dirección Stellar (opcional)</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-white" value={companyForm.stellar_address} onChange={e => setCompanyForm(f => ({ ...f, stellar_address: e.target.value }))} placeholder="G..." />
              </div>

              <button type="submit" disabled={!canSubmit || submittingCompany} className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all text-sm mt-2 disabled:opacity-50">
                {submittingCompany ? 'Guardando...' : 'Crear perfil'}
              </button>
            </form>

            {error && <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-xs text-red-200 font-mono">{error}</div>}
          </div>
        </main>
      </div>
    )
  }

  // --- Result ---
  if (step === 'result' && passportId) return (
    <div className="min-h-screen monopo-animated-bg text-white flex flex-col justify-between">
      {renderHeader()}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center shadow-2xl">
          <svg className="w-12 h-12 text-white/80 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h2 className="text-xl font-bold">¡Pasaporte emitido!</h2>
          <p className="text-xs text-white/70 mt-1 mb-5">Escanea el QR para verificar o descárgalo para imprimirlo</p>
          <div className="p-4 bg-white rounded-2xl inline-block mb-4">
            <PassportQR passportId={passportId} />
          </div>
          <p className="text-xs text-white/50 font-mono break-all">{passportId}</p>
          <div className="flex gap-3 justify-center mt-6">
            <a href={`/passport/${passportId}`} className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-mono">Ver detalle</a>
            <a href={`/verify/${passportId}`} className="px-4 py-2 bg-white text-black font-bold rounded-xl text-xs font-mono hover:bg-white/90">Verificar</a>
          </div>
        </div>
      </main>
    </div>
  )

  // --- Main form ---
  return (
    <div className="min-h-screen monopo-animated-bg text-white flex flex-col justify-between">
      {renderHeader()}
      <main className="flex-1 flex items-start justify-center p-4 md:p-8 my-6">
        <div className="w-full max-w-xl flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Emitir pasaporte</h1>
            <p className="text-xs text-white/60 mt-1 font-mono">
              Empresa: <span className="font-semibold text-white">{company?.name}</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="font-medium text-sm">Wallet Stellar</h3>
                  <p className="text-xs text-white/60">Necesaria para firmar la emisión</p>
                </div>
              </div>
              <WalletButton />
            </div>
            {wallet.isConnected && wallet.address && (
              <div className="mt-3 space-y-1.5">
                <p className="text-xs text-white/80 font-mono bg-black/30 p-2 rounded.xl border border-white/10">{wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}</p>
                {isIssuer === true && (
                  <p className="text-[10px] text-emerald-300 flex items-center gap-1 font-mono">
                    ✓ Certificada como issuer
                  </p>
                )}
                {isIssuer === false && (
                  <p className="text-[10px] text-red-300 flex items-center gap-1 font-mono">
                    ✕ No está certificada como issuer
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-3xl">
            <h3 className="font-semibold text-sm mb-5 font-mono uppercase tracking-wider text-white/80">Datos del producto</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Nombre del producto *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Café de Altura" required />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Categoría *</label>
                  <select className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                    <option value="" className="bg-neutral-900">Seleccionar...</option>
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-neutral-900">{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Descripción</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe el producto..." />
              </div>

              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Materiales (separados por coma)</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.materials} onChange={e => setForm(f => ({ ...f, materials: e.target.value }))} placeholder="lana, algodón, tintes naturales" />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Ciudad de origen *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.originCity} onChange={e => setForm(f => ({ ...f, originCity: e.target.value }))} placeholder="La Paz" required />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">País de origen *</label>
                  <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.originCountry} onChange={e => setForm(f => ({ ...f, originCountry: e.target.value }))} placeholder="BO" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Año de producción</label>
                  <input type="number" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-sm focus:outline-none focus:border-white font-mono" value={form.year} onChange={e => setForm(f => ({ ...f, year: parseInt(e.target.value) || new Date().getFullYear() }))} />
                </div>
                <div>
                  <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Fotos</label>
                  {existingImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {existingImages.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt="" className="w-12 h-12 rounded-lg object-cover border border-white/20" />
                          <button
                            type="button"
                            onClick={() => setExistingImages(prev => prev.filter((_, j) => j !== i))}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="file" multiple accept="image/*" className="w-full text-xs text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20" onChange={handleImageChange} />
                  <span className="text-[10px] text-white/40 block mt-1 font-mono">Máximo 5 MB por imagen</span>
                  {fileError && <span className="text-[10px] text-red-400 block mt-1 font-mono">{fileError}</span>}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono text-white/60 mb-1 block uppercase tracking-wider">Certificaciones</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 text-white text-xs font-mono focus:outline-none focus:border-white" value={form.certifications} onChange={e => setForm(f => ({ ...f, certifications: e.target.value }))} placeholder='[{"name":"Comercio Justo","issuer":"WFTO"}]' />
              </div>

              <button
                type="submit"
                disabled={!wallet.isConnected || contract.isLoading || txStatus === 'success'}
                className="w-full py-3.5 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-[1.01] transition-all text-sm shadow-lg mt-2 disabled:opacity-50"
              >
                {contract.isLoading ? 'Procesando...' : 'Emitir pasaporte →'}
              </button>
            </form>
          </div>

          {(txStatus !== 'idle' || error) && (
            <div className="glass-panel p-4 rounded-2xl">
              <TxStatus status={txStatus} txHash={contract.txHash} error={error || contract.error} message={txMessage} />
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-xs font-mono text-white/40 border-t border-white/10 bg-black/40">
        Passport LATAM • Powered by Soroban Smart Contracts
      </footer>
    </div>
  )
}