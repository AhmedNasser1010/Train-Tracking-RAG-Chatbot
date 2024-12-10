import { getEnvVar } from './config.js';

export async function getAccessToken() {
  const jwtToken = await getTokenFromGCPServiceAccount({
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
      scope: [
        // scope required for firestore
        'https://www.googleapis.com/auth/datastore',
        // The following scopes are required only for realtime database
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/firebase.database',
      ].join(' '),
    },
  })

  const accessToken = await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken, // the JWT token generated in the previous step
      }),
    })
  ).json()

  return accessToken
}