import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SignInForm } from "./auth/SignInForm"
import { SignUpForm } from "./auth/SignUpForm"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [activeTab, setActiveTab] = useState("signin")
  const { toast } = useToast()

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      toast({
        title: "Welcome!",
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
    } else if (event === 'PASSWORD_RECOVERY') {
      toast({
        title: "Password recovery email sent",
        description: "Check your email for the password reset link.",
      })
    }
  })

  const handleAuthMessage = (message: string) => {
    if (message.includes("user_already_exists")) {
      toast({
        title: "Account already exists",
        description: "Please sign in with your existing account.",
        variant: "destructive",
      });
      setActiveTab("signin");
    } else {
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const sharedAuthProps = {
    supabaseClient: supabase,
    appearance: {
      theme: ThemeSupa,
      style: {
        container: { width: '100%' },
        button: {
          width: '100%',
          borderRadius: 'var(--radius)',
          height: '2.5rem',
          fontSize: '0.875rem',
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
        },
        input: {
          borderRadius: 'var(--radius)',
          height: '2.5rem',
          fontSize: '0.875rem',
          borderColor: 'var(--input)',
        },
      },
    },
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Join our community or sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm sharedAuthProps={sharedAuthProps} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm sharedAuthProps={sharedAuthProps} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}