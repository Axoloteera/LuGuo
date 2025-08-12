import {unsafeWindow} from "$";

export function noExternalLink() {
    setTimeout(() => {
        unsafeWindow.document.querySelectorAll<HTMLAnchorElement>('a[target*=_blank]').forEach((a) => {
            a.target = '_self';
        })
    }, 100)
}