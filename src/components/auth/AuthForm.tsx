import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
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
              button: {
                borderRadius: '0.5rem',
                height: '2.5rem',
                fontSize: '0.875rem',
              },
              input: {
                borderRadius: '0.5rem',
                height: '2.5rem',
                fontSize: '0.875rem',
              },
              anchor: {
                color: 'var(--primary)',
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