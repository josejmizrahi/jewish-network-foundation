import { GalleryVerticalEnd, Loader2 } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { OnboardingModal } from "@/components/onboarding/OnboardingModal"
import { AuthChangeEvent } from "@supabase/supabase-js"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // If user has completed profile, navigate to home, otherwise show onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('profile_completed')
          .eq('id', session.user.id)
          .single()

        if (profile?.profile_completed) {
          navigate("/")
        } else {
          setShowOnboarding(true)
        }
      }
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN") {
        // Check if profile is completed
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('profile_completed')
            .eq('id', session.user.id)
            .single()

          if (profile?.profile_completed) {
            navigate("/")
          } else {
            setShowOnboarding(true)
          }
        }
      }
      if (event === "SIGNED_IN" || event === "SIGNED_UP") {
        setShowOnboarding(true)
      }
    })

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/50 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          JNS
        </a>
        <LoginForm />
      </div>
      {showOnboarding && <OnboardingModal />}
    </div>
  )
}