export function waitForElement(selector: any, timeout = 10000): Promise<HTMLElement> {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);

        const obs = new MutationObserver((_, ob) => {
            const e = document.querySelector(selector);
            if (e) {
                ob.disconnect();
                resolve(e);
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            obs.disconnect();
            reject();
        }, timeout);
    });
}

