// @ts-ignore isolatedModules
import {homework_rank_sticky} from "./homework_rank";
import {user_profile_display} from "./user_profile_display";
import {unsafeWindow} from "$";
import {print} from "./utils";
import {hookXhr} from "./xhrHook";
import {registerTestcaseGetter} from "./testcase_getter";
import {onDoubleShift} from "./cmd_panel";

print("LuGuo 尝试加载中...")

function onRouteChange() {
    const url = unsafeWindow.location.pathname + unsafeWindow.location.hash;
    if ( /^\/training\/\d+#rank$/.test(url) ) homework_rank_sticky();
    if ( /^\/user\/\d+$/.test(url) ) user_profile_display();
}

const vueApp = unsafeWindow.document.querySelector('#app') as any;
if (vueApp && vueApp.__vue__ && vueApp.__vue__.$router) {
    vueApp.__vue__.$router.afterHooks.push(()=>{
        print("检测到路由变化。")
        // 等待页面加载
        setTimeout(onRouteChange, 250);
    })
} else {
    print('未找到Vue App, 加载失败', 'error')
}

const shiftDelay = 300;
let lastShiftTime = 0;

unsafeWindow.addEventListener('keydown', (e) => {
    if (e.key !== 'Shift' || e.repeat) return;
    console.log("bb")

    const now = Date.now();
    if (now - lastShiftTime <= shiftDelay) {
        onDoubleShift();
        lastShiftTime = 0;
    } else {
        lastShiftTime = now;
    }
}, true);


onRouteChange();

hookXhr();
registerTestcaseGetter();