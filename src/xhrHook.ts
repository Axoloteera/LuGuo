type XHRCallback = (data: { url: string; method: string; response: string }) => void;

interface CustomXMLHttpRequest extends XMLHttpRequest {
    _method: string;
    _url: string;
}

const xhrCallbacks: XHRCallback[] = [];

export function hookXhr() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method: string, url: string | URL, ...rest: any[]) {
        const customThis = this as CustomXMLHttpRequest;
        customThis._method = method;
        customThis._url = url.toString();
        originalOpen.apply(this, [method, url, ...rest] as any);
    };

    XMLHttpRequest.prototype.send = function (...args) {
        this.addEventListener('load', function () {
            const customThis = this as CustomXMLHttpRequest;
            const response = this.responseText;
            const url = customThis._url;
            const method = customThis._method;

            xhrCallbacks.forEach((callback) => callback({ url, method, response }));
        });

        originalSend.apply(this, args);
    };
}

export function onXhrResponse(callback: XHRCallback) {
    xhrCallbacks.push(callback);
}
