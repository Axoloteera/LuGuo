export function waitForElement(selector: any, timeout: number | null = null): Promise<HTMLElement> {
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

        if(timeout) {
            setTimeout(() => {
                obs.disconnect();
                reject();
            }, timeout);
        }
    });
}

export function waitForElementRemoval(selector: any, timeout: number | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
        const el = document.querySelector(selector);
        if (!el) return resolve();

        const obs = new MutationObserver((_, ob) => {
            const e = document.querySelector(selector);
            if (!e) {
                ob.disconnect();
                resolve();
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });

        if(timeout) {
            setTimeout(() => {
                obs.disconnect();
                reject();
            }, timeout);
        }
    });
}

export function print(message: string = "", type: 'log' | 'error' = 'log') {
    if ( type === 'log' ) {
        console.log(`[LuGuo] ${message}`);
    } else {
        console.error(`[LuGuo] ${message}`);
    }
}



