import {
    GM_getValue,
    GM_setValue,
    GM_setClipboard,
    GM_registerMenuCommand,
    GM_unregisterMenuCommand,
} from "$";

type Settings = {
    enableNoExternalLink: boolean;
    enableCommandPanel: boolean;
    enableTestcaseGetter: boolean;
    enableHomeworkRankSticky: boolean;
    enableUserProfileDisplay: boolean;

};

const STORAGE_KEY = "luguo-settings";
const defaults: Settings = {
    enableNoExternalLink: true,
    enableCommandPanel: true,
    enableTestcaseGetter: true,
    enableHomeworkRankSticky: true,
    enableUserProfileDisplay: true,
};
const labels: Record<keyof Settings, string> = {
    enableNoExternalLink: "启用单个页面内转跳",
    enableCommandPanel: "启用命令面板",
    enableTestcaseGetter: "启用测试用例获取",
    enableHomeworkRankSticky: "启用作业排名增强",
    enableUserProfileDisplay: "启用用户个人简介展示",
};

function load(): Settings {
    const saved = (GM_getValue(STORAGE_KEY, {}) || {}) as Partial<Settings>;
    return { ...defaults, ...saved };
}

function save(partial: Partial<Settings>) {
    const cur = load();
    GM_setValue(STORAGE_KEY, { ...cur, ...partial });
    rebuildMenus();
}

function reset() {
    GM_setValue(STORAGE_KEY, defaults);
    rebuildMenus();
}

let menuIds: any[] = [];

function clearMenus() {
    for (const id of menuIds) {
        try { GM_unregisterMenuCommand(id); } catch {}
    }
    menuIds = [];
}

function addMenu(title: string, fn: () => void) {
    const id = GM_registerMenuCommand(title, fn);
    if (id != null) menuIds.push(id);
}

function rebuildMenus() {
    clearMenus();
    const s = load();

    (Object.keys(labels) as (keyof Settings)[]).forEach((key) => {
        const title = `(${s[key] ? "已开启" : "已关闭"}) ${labels[key]}`;
        addMenu(title, () => {
            const cur = load()[key] as boolean;
            save({ [key]: !cur } as Partial<Settings>);
        });
    });

    addMenu("导出配置到剪贴板", () => {
        const text = JSON.stringify(load(), null, 2);
        try {
            GM_setClipboard(text, 'text/plain');
        } catch {
            alert("无法复制到剪贴板。");
            return;
        }
        console.log(text);
        alert("已复制到剪贴板。");
    });

    addMenu("导入配置（粘贴 JSON）", () => {
        const text = prompt("粘贴导出的 JSON：");
        if (!text) return;
        try {
            const obj = JSON.parse(text) as Partial<Settings>;
            GM_setValue(STORAGE_KEY, { ...defaults, ...obj });
            rebuildMenus();
            alert("导入成功");
        } catch {
            alert("JSON 解析失败");
        }
    });

    addMenu("恢复默认", () => {
        reset();
        alert("已恢复默认");
    });
}

export function show_settings() {
    rebuildMenus();
}
