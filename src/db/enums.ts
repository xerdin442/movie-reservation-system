export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

export enum SubscriptionTier {
  FREE = 'free',
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise',
}

export enum StaffRole {
  EXECUTIVE = 'executive',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum MovieGenre {
  ACTION = 'action',
  MYSTERY = 'mystery',
  CRIME = 'crime',
  SUPERNATURAL = 'supernatural',
  THRILLER = 'thriller',
  HISTORICAL = 'historical',
  MUSICAL = 'musical',
  KIDS = 'kids',
  DRAMA = 'drama',
  WAR = 'war',
  DOCUMENTARY = 'documentary',
  BIOGRAPHY = 'biography',
  ANIMATION = 'animation',
  ROMANCE = 'romance',
  HORROR = 'horror',
  COMEDY = 'comedy',
  SCI_FI = 'sci_fi',
  SPORTS = 'sports',
  FANTASY = 'fantasy',
  OTHERS = 'others',
}

export enum MovieStatus {
  RUNNING = 'running',
  ENDED = 'ended',
}

export enum TransactionStatus {
  PENDING = 'pending',
  FAILED = 'failed',
  SUCCESS = 'success',
}

export enum TransactionMethod {
  FIAT = 'fiat',
  CRYPTO = 'crypto',
}

export enum TransactionSource {
  RESERVATION = 'reservation',
  MEMBERSHIP = 'membership',
}

export enum ReservationStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
}
