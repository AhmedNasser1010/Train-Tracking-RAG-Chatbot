export type FirebaseAccessTokenResponse = {
  access_token: string;  // The actual access token
  expires_in: number;    // Time (in seconds) before the token expires
  token_type: 'Bearer';
};
