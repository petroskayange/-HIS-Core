// import { Router } from "vue-router";
import router from '@/router/index';
import {
    toastController,
} from "@ionic/vue";
const ApiClient = (() => {
    interface Config {
        protocol?: string;
        host?: string;
        port?: string;
        apiVersion?: string;
        username?: string;
        password?: string;
        version?: string;
        source?: string;
    }
    const showMessage =async (message: string) => {
        const toast = await toastController.create({
            message: message,
            position: "top",
            animated: true,
            duration: 6000,
            color: 'warning'
        });
        return toast.present();
    };
    async function getConfig(): Promise<{ status: string; data?: Config | undefined; message?: string }> {
        try {

            const response = await fetch('/config.json');

            if (response.status !== 200) {
                const message = `Looks like there was a problem. Status Code: ${response.status}`;
                return { status: "error", message:  message};
            }
            const config: Config = {};
            const data = await response.json();
            sessionStorage.setItem("apiURL", data.apiURL);
            config.host = data.apiURL;
            sessionStorage.setItem("apiPort", data.apiPort);
            config.port = data.apiPort;
            sessionStorage.setItem("apiProtocol", data.apiProtocol);
            config.protocol = data.apiProtocol;
            config.version = data.version;
            config.source = data;

            return { status: "complete", data: config };
        } catch (err) {
            return { status: "error" };
        }
    }
    async function expandPath(resourcePath: string) {
        const config = await getConfig();
        if(config.message) {
            showMessage(config.message);
        }
        if (config.data) {
            return {
                status: "complete",
                url: `${config.data.protocol}://${config.data.host}:${config.data.port}/api/v1/${resourcePath}`
            };
        } else {
            return {
                status: "failed",
                url: "/"
            };
        }
    }

    function headers() {
        return {
            'Authorization': sessionStorage.apiKey,
            'Content-Type': 'application/json'
        };
    }

    async function execFetch(uri: string, params: object, noRedirectCodes: number[] = []) {
        const pathData = await expandPath(uri)
        if (pathData.status == "complete") {
            const url = pathData.url;
            params = { ...params, mode: 'cors' };

            if (!('headers' in params)) {
                params = { ...params, headers: headers() };
            }

            let response;

            try {
                response = await fetch(url, params);
                if (response.status === 401 && !noRedirectCodes.includes(response.status)
                    && window.location.href.search(/login\/?$/) < 0) {
                    router.push('/login');
                    return null;
                } else if (response.status >= 500 && !noRedirectCodes.includes(response.status)) {
                    const { error, exception } = await response.json();
                    showMessage(`${error} - ${exception}`);
                    return null;
                } else {
                    return response;
                }
            } catch (e) {
                console.error(`Failed to fetch ${url}`, e);
                showMessage(`Failed to fetch ${url}`);
                return null;
            }
        }
        else {
            showMessage('could not configure services');
        }
    }
    

    const get = (uri: string, options = []) => execFetch(uri, { method: 'GET' }, options)

    // /**
    //  * Perform a POST request on the API
    //  * 
    //  * @param {string} uri Path to resource being accessed. 
    //  * @param {Object} data Parameters to send to API.
    //  * 
    //  * Example:
    //  *   const response = post('people', {given_name: 'Foo', family_name: 'Bar}).then((response) => console.log(response));
    //  */
    const post = (uri: string, data: object, options = []) => execFetch(uri, { method: 'POST', body: JSON.stringify(data) }, options);
    const remove = (uri: string, data: object, options = []) => execFetch(uri, { method: 'DELETE', body: JSON.stringify(data) }, options);
    const put = (uri: string, data: object, options = []) => execFetch(uri, { method: 'PUT', body: JSON.stringify(data) }, options);
    const setRouter = (route: any) => route = router;
    return { get, post, put, remove, getConfig, setRouter };
})();

export default ApiClient;
