import { NGROK_AUTHTOKEN, NGROK_DOMAIN, PORT } from "../config";

/**
 * Starts ngrok with the specified configuration
 * @returns {Promise<string>} The URL of the ngrok tunnel
 */
export default async () => {
  const ngrok = await import("@ngrok/ngrok");
  let ngrokURL = "";

  try {
    if (NGROK_AUTHTOKEN && NGROK_DOMAIN) {
      const listener = await ngrok.connect({
        addr: PORT,
        authtoken: NGROK_AUTHTOKEN as string,
        domain: NGROK_DOMAIN as string,
      });
      ngrokURL = listener.url() as string;
    } else {
      const listener = await ngrok.connect({ addr: PORT });
      ngrokURL = listener.url() as string;
    }
  } catch (error) {
    console.log(
      "\n[NGROK] Invalid Domain or Auth Token. Please check your .env file.\nStarting ngrok on random domain."
    );
    const listener = await ngrok.connect({ addr: PORT });
    ngrokURL = listener.url() as string;
  }

  if (ngrokURL) {
    console.log(`\n[NGROK] Started on ${ngrokURL}\n`);
    return ngrokURL;
  }

  return "";
};
