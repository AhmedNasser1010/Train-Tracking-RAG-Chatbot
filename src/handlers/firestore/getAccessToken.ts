import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt'
import { getEnvVar } from '../../config';
import { JwtToken } from '../../types/JwtToken';
import { FirebaseAccessTokenResponse } from '../../types/FirebaseAccessTokenResponse';

export async function getAccessToken(): Promise<FirebaseAccessTokenResponse> {
  const jwtTokenData: JwtToken = {
    serviceAccountJSON: {
      type: 'service_account',
      project_id: getEnvVar('PROJECT_ID'),
      private_key_id: getEnvVar('PRIVATE_KEY_ID'),
      private_key: getEnvVar('PRIVATE_KEY'),
      client_email: getEnvVar('CLIENT_EMAIL'),
      client_id: getEnvVar('CLIENT_ID'),
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: getEnvVar('CLIENT_X509_CERT_URL'),
    },
    aud: 'https://oauth2.googleapis.com/token',
    payloadAdditions: {
      scope: 'https://www.googleapis.com/auth/datastore',
    },
  };
  const jwtToken = await getTokenFromGCPServiceAccount(jwtTokenData)

  const accessToken: FirebaseAccessTokenResponse = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken,
      }),
    })
  ).json();

  return accessToken;
}