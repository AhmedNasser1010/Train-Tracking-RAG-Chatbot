import { getAccessToken } from "../../utilite/getAccessToken";
import { getEnvVar } from "../../config";

export async function getCollection() {
  const accessToken = await getAccessToken()

  const response = await (
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${getEnvVar(PROJECT_ID)}/databases/(default)/documents/trains`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + accessToken.access_token,
        },
      }
    )
  ).json()

  return response
}