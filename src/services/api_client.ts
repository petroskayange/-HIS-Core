import { Router } from "vue-router";

const ApiClient = (() => {
    interface Config {
        protocol?: string;
        host?: string;
        port?: string;
        apiVersion?: string;
        username?: string;
        password?: string;
        // router?: any,
        version?: string;
        source?: string;
    }
    let router: Router;

    // let config : Config = {    // Load from config file
    //   protocol: null,
    //   host: null,
    //   port: null,
    //   apiVersion: 'v1',
    //   username: null,
    //   password: null,
    //   router: null,
    //   version: null,
    //   source: null  // The actual config object stored on the server
    // }



    async function getConfig(): Promise<{ status: string; data?: Config | undefined }> {
        try {

            const response = await fetch('/config.json');

            if (response.status !== 200) {
                console.error(`Looks like there was a problem. Status Code: ${response.status}`);
                return { status: "error" };
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
            console.log('Fetch Error :-S', err);
            return { status: "error" };
        }
    }
    async function expandPath(resourcePath: string) {
        const config = await getConfig();
        if (config.data) {
            console.log(config);
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
    function getRouter() {
        if (!router) {
            throw new Error('Router not configured');
        }

        return router;
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
                    // getRouter().push({ name: 'error', query: { message: `${error} - ${exception}` } })
                    return null;
                } else {
                    return response;
                }
            } catch (e) {
                console.error(`Failed to fetch ${url}`, e);
                // getRouter().push({ name: 'error', query: { 'message': `Could not fetch ${url} due to ${e.name} - ${e.message}` } })
                return null;
            }


        }
        else {
            alert('could not configure services');
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
