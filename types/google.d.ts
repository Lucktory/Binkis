interface GoogleAccountsIdInitializeConfig {
  client_id: string;
  callback: (response: { credential: string; select_by?: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
}

interface GoogleAccountsIdButtonOptions {
  type?: "standard" | "icon";
  theme?: "outline" | "filled_blue" | "filled_black";
  size?: "small" | "medium" | "large";
  text?: "signin_with" | "signup_with" | "continue_with" | "signin";
  shape?: "rectangular" | "pill" | "circle" | "square";
  logo_alignment?: "left" | "center";
  width?: number;
  locale?: string;
}

interface GoogleAccountsIdApi {
  initialize: (config: GoogleAccountsIdInitializeConfig) => void;
  renderButton: (parent: HTMLElement, options: GoogleAccountsIdButtonOptions) => void;
  prompt?: () => void;
  cancel?: () => void;
}

interface Window {
  google?: {
    accounts?: {
      id?: GoogleAccountsIdApi;
    };
  };
}
