// @ts-ignore isolatedModules
import {homework_rank_sticky} from "./homework_rank";

console.log('hello world3');

function onRouteChange() {
    homework_rank_sticky();
}

function wrapHistory(method: 'pushState' | 'replaceState') {
    const origin = history[method];
    return () =>{
        origin.apply(history, arguments as any);
        window.dispatchEvent(new Event(method));
    };
}
wrapHistory('pushState');
wrapHistory('replaceState');
window.addEventListener('popstate', onRouteChange);
window.addEventListener('pushState', onRouteChange);
window.addEventListener('replaceState', onRouteChange);

onRouteChange();