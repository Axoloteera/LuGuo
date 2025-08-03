// @ts-ignore isolatedModules
import {homework_rank_sticky} from "./homework_rank";
import {unsafeWindow} from "$";
import {print} from "./utils";

print("LuGuo 尝试加载中...")

function onRouteChange() {
    const url = unsafeWindow.location.pathname + unsafeWindow.location.hash;
    if ( /^\/training\/\d+#rank$/.test(url) ) homework_rank_sticky();
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

onRouteChange();