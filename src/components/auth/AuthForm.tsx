import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Apple or Google account
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
                },
                label: {
                  fontSize: '0.875rem',
                  color: 'var(--foreground)',
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
            providers={["google", "apple"]}
          />
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}