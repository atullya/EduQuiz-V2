export interface UserProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface UserData {
  _id?: string;
  email?: string;
  username?: string;
  role?: string;
  profile?: UserProfile;
}
