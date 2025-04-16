export interface ScreenConfig {
  name: string;
  title: string;
}
export const SCREENS: Record<string, ScreenConfig> = {
  INDEX: { name: "index", title: "" },
  TABS: { name: "(tabs)", title: "" },
  MAIN: { name: "(main)", title: "" },
  LOGIN: { name: "(auth)/login", title: "" },
  REGISTER: { name: "(auth)/register", title: "" },
  VERIFY_ACCOUNT: { name: "(auth)/verify_account", title: "" },
  SEND_OTP: { name: "(auth)/send_otp", title: "" },
  FORGOT_PASSWORD: { name: "(auth)/forgot_password", title: "" },
  CHANGE_PASSWORD: { name: "(auth)/change_password", title: "" },
  VERIFY_EMAIL_PASSWORD: { name: "(auth)/verify_email_phone", title: "" },
};
