import {GM_getValue, unsafeWindow} from "$";

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

export function getUserName(): string {
    const w = unsafeWindow as any;
    return (
        w._feInjection?.currentUser?.name?.trim?.() ||
        w.document.querySelector('.name')?.textContent?.trim() ||
        ''
    );
}

export function getSetting(key: string): boolean {
    const settings = GM_getValue("luguo-settings");
    return settings[key] !== undefined ? settings[key] : true;
}

export function createPopup(content: string, type: 'textarea' | 'html' = 'html') {
    const container = unsafeWindow.document.createElement('div');
    Object.assign(container.style, {
        position: 'fixed',
        top: '10%',
        left: '20%',
        zIndex: '99999',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        padding: '1em',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto'
    });

    const closeBtn = unsafeWindow.document.createElement('button');
    closeBtn.textContent = '×关闭';
    Object.assign(closeBtn.style, {
        position: 'absolute',
        top: '5px',
        right: '10px',
        fontSize: '1.2em',
    });
    closeBtn.onclick = () => container.remove();
    container.appendChild(closeBtn);

    if (type === 'textarea') {
        const textarea = unsafeWindow.document.createElement('textarea');
        textarea.value = content;
        textarea.readOnly = true;
        textarea.style.width = '100%';
        textarea.style.height = '200px';
        container.appendChild(textarea);

        const copyBtn = unsafeWindow.document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.style.marginTop = '0.5em';
        copyBtn.onclick = async () => {
            try {
                await navigator.clipboard.writeText(textarea.value);
                copyBtn.textContent = '已复制';
                setTimeout(() => (copyBtn.textContent = '复制'), 2000);
            } catch (err) {
                console.error('复制失败:', err);
                alert('复制失败，浏览器可能不支持 Clipboard API');
            }
        };
        container.appendChild(copyBtn);
    } else {
        const htmlContent =unsafeWindow. document.createElement('div');
        htmlContent.innerHTML = content;
        container.appendChild(htmlContent);
    }

    unsafeWindow.document.body.appendChild(container);
}


