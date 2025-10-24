export type SessionData = {
  email?: string;
  otp?: string;
  otpExpiration?: number;
};

export type AuthRole = 'organization' | 'staff' | 'admin';

export interface JwtValidatedPayload {
  id: number;
  role: AuthRole;
}

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

export type CloudinaryResourcesResponse = {
  resources: [
    {
      asset_id: string;
      public_id: string;
      format: string;
      version: number;
      resource_type: string;
      type: string;
      created_at: string;
      bytes: number;
      width?: number;
      height?: number;
      asset_folder: string;
      display_name: string;
      url: string;
      secure_url: string;
      tags?: string[];
      next_cursor?: string;
    },
  ];
  next_cursor?: string;
};

export type BankData = {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AccountDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
};
