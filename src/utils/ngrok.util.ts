import { NGROK_AUTHTOKEN, NGROK_DOMAIN, PORT } from "../config";

/**
 * Starts ngrok with the specified configuration
 * @returns {Promise<string>} The URL of the ngrok tunnel
 */
export default async (): Promise<string> => {
  const ngrok = await import("@ngrok/ngrok");
  let ngrokURL = "";

  try {
    if (NGROK_AUTHTOKEN && NGROK_DOMAIN) {
      const listener = await ngrok.connect({
        addr: PORT,
        authtoken: NGROK_AUTHTOKEN,
        domain: NGROK_DOMAIN,
      });
      ngrokURL = listener.url() || "";
    } else {
      const listener = await ngrok.connect({ addr: PORT });
      ngrokURL = listener.url() || "";
    }
  } catch (error) {
    console.error(
      "[NGROK] Error starting ngrok with specified domain or auth token. Falling back to random domain.",
      error
    );
    try {
      const listener = await ngrok.connect({ addr: PORT });
      ngrokURL = listener.url() || "";
    } catch (fallbackError) {
      console.error(
        "[NGROK] Failed to start ngrok on a random domain.",
        fallbackError
      );
      return "";
    }
  }

  if (ngrokURL) {
    console.log(`[NGROK] Started on ${ngrokURL}\n`);
    return ngrokURL;
  }

  return "";
};
