import {print, waitForElement} from "./utils";

export function user_profile_display() {
    waitForElement('.introduction.marked')
        .then(el => {
            el.style.display = 'block';
            const cover = Array.from(document.querySelectorAll('div')).find(div =>
                div.textContent.trim() === '系统维护，该内容暂不可见。'
            ) as HTMLElement;
            if (cover) cover.style.display = 'none';
        })
        .catch(_ => print("用户简介加载失败", "error"));
}