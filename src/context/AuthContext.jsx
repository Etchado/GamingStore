import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

function mapUser(sbUser, displayName = null) {
  if (!sbUser) return null
  const meta = sbUser.user_metadata ?? {}
  const firstName = meta.first_name ?? meta.full_name?.split(' ')[0] ?? ''
  const lastName  = meta.last_name  ?? meta.full_name?.split(' ').slice(1).join(' ') ?? ''
  const fallbackName = [firstName, lastName].filter(Boolean).join(' ') || sbUser.email?.split('@')[0] || 'User'
  return {
    id:     sbUser.id,
    name:   displayName ?? fallbackName,
    email:  sbUser.email  ?? null,
    phone:  sbUser.phone  ?? null,
    method: sbUser.app_metadata?.provider ?? 'email',
  }
}

async function fetchDisplayName(userId) {
  const { data } = await supabase.from('profiles').select('display_name').eq('id', userId).maybeSingle()
  return data?.display_name ?? null
}

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [pendingPhone, setPendingPhone] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const displayName = await fetchDisplayName(session.user.id)
        setUser(mapUser(session.user, displayName))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const displayName = await fetchDisplayName(session.user.id)
        setUser(mapUser(session.user, displayName))
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signInWithEmail(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function register(firstName, lastName, email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    })
    return { error }
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/account' },
    })
    return { error }
  }

  async function signInWithApple() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: window.location.origin + '/account' },
    })
    return { error }
  }

  async function requestOTP(phone) {
    setPendingPhone(phone)
    const { error } = await supabase.auth.signInWithOtp({ phone: '+966' + phone })
    return { error }
  }

  async function verifyOTP(code) {
    if (!pendingPhone) return { error: { message: 'No pending phone number' } }
    const { error } = await supabase.auth.verifyOtp({
      phone: '+966' + pendingPhone,
      token: code,
      type: 'sms',
    })
    if (!error) setPendingPhone(null)
    return { error }
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/account?reset=true',
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      pendingPhone,
      signInWithEmail,
      register,
      requestOTP,
      verifyOTP,
      signInWithGoogle,
      signInWithApple,
      resetPassword,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
