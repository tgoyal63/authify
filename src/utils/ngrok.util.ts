import { getConfig, setDynamicRedirectURI } from "../config";

export default () =>{
    if(process.env["NODE_ENV"] === 'development') {
        import('@ngrok/ngrok').then(ngrok => {
        (async function() {
            let ngrokURL = '';
            try {
                if(getConfig().ngrokAuthToken && getConfig().ngrokDomain) {
                    const listener = await ngrok.connect({
                        addr: getConfig().port,
                        authtoken_from_env: true,
                        domain: getConfig().ngrokDomain as string,
                    }
                    );
                    ngrokURL = listener.url() as string;
                }
                else{
                    const listener = await ngrok.connect({
                        addr: getConfig().port,
                    }
                    );
                    ngrokURL = listener.url() as string;
                }
            } catch (error) {
                console.log("\n[NGROK]Invalid Domain or Auth Token. Please check your .env file.\nStarting ngrok on random domain.")
                const listener = await ngrok.connect({
                    addr: getConfig().port,
                }
                );
                ngrokURL = listener.url() as string;
            }
            if(ngrokURL) {
                console.log(`\n[NGROK]Started on ${ngrokURL}\n`);
                setDynamicRedirectURI(`${ngrokURL}/callback`)
            }
        })();
    })}
}