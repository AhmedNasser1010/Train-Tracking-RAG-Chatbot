import { getAccessToken } from "./getAccessToken";
import { getEnvVar } from "../../config";

// Usage:
// const data = await getCollection('trains');
// console.log(data); // return's {...}

export async function getCollection(collection: string): Promise<any> {
  const accessToken = await getAccessToken()

  const response = await (
    await fetch(
      `https://firestore.googleapis.com/v1/projects/${getEnvVar('PROJECT_ID')}/databases/(default)/documents/${collection}`,
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