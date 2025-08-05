import {onXhrResponse} from "./xhrHook";
import {unsafeWindow} from "$";
import {createPopup, print} from "./utils";

export function registerTestcaseGetter() {
    onXhrResponse((data) => {
        if (data.url.includes('/fe/api/record/downloadTestcase/') && data.method === 'POST') {
            const dataObj = JSON.parse(data.response);
            const div = unsafeWindow.document.querySelector('.full-container > .main > section > div:nth-of-type(2) > div')
            const newChild = unsafeWindow.document.createElement('div');
            newChild.className = 'card padding-default';
            newChild.style = 'background-color: rgb(127, 127, 255); margin-top: 10px; padding: 10px;';
            newChild.innerText = "测试用例获取（无需手动下载，可直接预览或复制）";
            const inBtn = unsafeWindow.document.createElement('button');
            inBtn.className = "lfe-form-sz-small";
            inBtn.style = "border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);";
            inBtn.innerText = "查看测试用例输入";
            inBtn.onclick = () => {
                createPopup(decodeURIComponent(atob(dataObj.input)), 'textarea');
            }
            newChild.appendChild(inBtn);
            const outBtn = unsafeWindow.document.createElement('button');
            outBtn.className = "lfe-form-sz-small";
            outBtn.style = "border-color: rgb(52, 152, 219); background-color: rgb(52, 152, 219);";
            outBtn.innerText = "查看测试用例输出";
            outBtn.onclick = () => {
                createPopup(decodeURIComponent(atob(dataObj.output)), 'textarea');
            };
            newChild.appendChild(outBtn);
            if (div) {
                div.appendChild(newChild);
            } else {
                print("未找到测试用例显示区域，可能是页面结构已更改。", 'error');
            }
        }
    });
}