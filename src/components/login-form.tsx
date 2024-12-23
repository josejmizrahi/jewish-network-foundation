import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Handle auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } else if (event === 'SIGNED_OUT') {
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } else if (event === 'USER_UPDATED') {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } else if (event === 'USER_DELETED') {
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      })
    } else if (event === 'PASSWORD_RECOVERY') {
      toast({
        title: "Password recovery email sent",
        description: "Check your email for the password reset link.",
      })
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                container: {
                  width: '100%',
                },
                button: {
                  width: '100%',
                  borderRadius: 'var(--radius)',
                  height: '2.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                },
                input: {
                  borderRadius: 'var(--radius)',
                  height: '2.5rem',
                  fontSize: '0.875rem',
                  borderColor: 'var(--input)',
                },
                anchor: {
                  color: 'var(--primary)',
                  fontSize: '0.875rem',
                },
                divider: {
                  backgroundColor: 'var(--border)',
                },
                message: {
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                  padding: '0.5rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--accent)',
                  marginBottom: '1rem',
                },
                label: {
                  fontSize: '0.875rem',
                  color: 'var(--foreground)',
                },
                loader: {
                  color: 'var(--primary)',
                },
              },
              variables: {
                default: {
                  colors: {
                    brand: 'var(--primary)',
                    brandAccent: 'var(--primary)',
                  },
                },
              },
            }}
            theme="light"
            providers={["google", "apple", "github"]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={true}
            localization={{
              variables: {
                sign_in: {
                  social_provider_text: "Continue with {{provider}}",
                  divider_text: "or",
                },
              },
            }}
          />
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}