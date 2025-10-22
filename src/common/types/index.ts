export type SessionData = {
  email?: string;
  otp?: string;
  otpExpiration?: number;
};

export type SocialAuthUser = {
  // user?: User;
  token: string;
  twoFactorAuth?: boolean;
};

export type SocialAuthPayload = {
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
};
