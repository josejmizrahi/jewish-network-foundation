import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function AuthForm() {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Choose your preferred sign in method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            style: {
              container: {
                width: '100%',
              },
              button: {
                borderRadius: '0.5rem',
                height: '2.5rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
              },
              input: {
                borderRadius: '0.5rem',
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
          providers={[]}
        />
      </CardContent>
    </Card>
  );
}