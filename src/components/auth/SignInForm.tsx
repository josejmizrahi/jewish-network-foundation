import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"

interface SignInFormProps {
  sharedAuthProps: {
    supabaseClient: typeof supabase;
    appearance: {
      theme: typeof ThemeSupa;
      style: {
        container: { width: string };
        button: {
          width: string;
          borderRadius: string;
          height: string;
          fontSize: string;
          backgroundColor: string;
          color: string;
        };
        input: {
          borderRadius: string;
          height: string;
          fontSize: string;
          borderColor: string;
        };
      };
    };
  };
}

export function SignInForm({ sharedAuthProps }: SignInFormProps) {
  return (
    <Auth
      {...sharedAuthProps}
      view="sign_in"
      localization={{
        variables: {
          sign_in: {
            email_label: "Email address",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Your password",
            button_label: "Sign in",
            loading_button_label: "Signing in...",
            social_provider_text: "Continue with {{provider}}",
          }
        }
      }}
    />
  );
}