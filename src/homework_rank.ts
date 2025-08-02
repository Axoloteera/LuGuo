import {waitForElement} from "./utils";

console.log("homework_rank");

export function homework_rank_sticky() {
    waitForElement('.header-wrap .header')
        .then(header => {
            if (!header) return;
            if (document.body.dataset.__luguo_homework_rank_sticky === 'done') return;
            const scrollEl = document.querySelector('.card.padding-default > div[style*="overflow"]');
            if (!scrollEl) return;


            const headerCells = Array.from(header.children);
            const numFixed = 3;
            const widths = headerCells.slice(0, numFixed)
                .map(th => th.getBoundingClientRect().width);

            let offset = 0;
            for (let idx = 1; idx <= numFixed; idx++) {
                const sel = `.header-wrap .header > *:nth-child(${idx}), .row-wrap .row > *:nth-child(${idx})`;

                scrollEl.querySelectorAll(sel).forEach((cell: Element) => {
                    Object.assign((cell as HTMLElement).style, {
                        position:   'sticky',
                        left:       offset + 'px',
                        background: '#fff',
                        zIndex:     idx === 1 ? 3 : 2,
                    });
                });
                offset += widths[idx-1];
            }


            document.body.dataset.__luguo_homework_rank_sticky = 'done';
        })
        .catch(_=>{console.error('homework_rank init error')});
}