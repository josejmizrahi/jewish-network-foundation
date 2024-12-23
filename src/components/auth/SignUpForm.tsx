import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"

interface SignUpFormProps {
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

export function SignUpForm({ sharedAuthProps }: SignUpFormProps) {
  return (
    <Auth
      {...sharedAuthProps}
      view="sign_up"
      localization={{
        variables: {
          sign_up: {
            email_label: "Email address",
            password_label: "Password",
            email_input_placeholder: "Your email address",
            password_input_placeholder: "Create a password",
            button_label: "Sign up",
            loading_button_label: "Signing up...",
            social_provider_text: "Continue with {{provider}}",
          }
        }
      }}
    />
  );
}