import {unsafeWindow} from "$";
import {getUserName} from "./utils";

function getResults(cmd: string): Record<string, Function>[] {
    let results: Record<string, Function>[] = [];
    const userName = getUserName();
    const path = unsafeWindow.location.pathname;
    const params = new URLSearchParams(unsafeWindow.location.search);

    if ( !cmd ) {
        if ( path.startsWith('/problem/') ) {
            const problem_id = path.split('/').pop();
            if ( problem_id ) {
                results.push({
                    [`查看题目 ${problem_id} 的个人提交记录`]: () => {
                        unsafeWindow.location.href = `/record/list?pid=${problem_id}&user=${userName}&page=1`;
                    }
                });
                results.push({
                    [`查看题目 ${problem_id} 的所有提交记录`]: () => {
                        unsafeWindow.location.href = `/record/list?pid=${problem_id}&page=1`;
                    }
                });
            }
        }

        if ( path.startsWith('/record/list') && params.get('user') !== userName && params.get('pid') ) {
            const problem_id = params.get('pid');
            results.push({
                [`查看题目 ${problem_id} 的个人提交记录`]: () => {
                    unsafeWindow.location.href = `/record/list?pid=${problem_id}&user=${userName}&page=1`;
                }
            });
            results.push({
                [`查看题目 ${problem_id}`]: () => {
                    unsafeWindow.location.href = `/problem/${problem_id}`;
                }
            });
        }

        if ( path.startsWith('/record/list') && params.get('user') && params.get('pid') ) {
            const problem_id = params.get('pid');
            results.push({
                [`查看题目 ${problem_id} 的所有提交记录`]: () => {
                    unsafeWindow.location.href = `/record/list?pid=${problem_id}&page=1`;
                }
            });
            results.push({
                [`查看题目 ${problem_id}`]: () => {
                    unsafeWindow.location.href = `/problem/${problem_id}`;
                }
            });
        }

        results.push({
            '查看个人提交记录': () => {
                unsafeWindow.location.href = `/record/list?user=${userName}&page=1`;
            }
        });
    }


    if (/^\d+$/.test(cmd)) {
        const id = parseInt(cmd, 10);
        const problem_id = `P${id}`;
        results.push({
            [`查看题目 ${problem_id}`]: () => {
                unsafeWindow.location.href = `/problem/${problem_id}`;
            }
        })
        results.push({
            [`查看题目 ${problem_id} 的个人提交记录`]: () => {
                unsafeWindow.location.href = `/record/list?pid=${problem_id}&user=${userName}&page=1`;
            }
        })
    }

    if (/^[a-zA-Z]\d+$/.test(cmd)) {
        //第一个字母大写
        const problem_id = cmd.charAt(0).toUpperCase() + cmd.slice(1);
        results.push({
            [`查看题目 ${problem_id}`]: () => {
                unsafeWindow.location.href = `/problem/${problem_id}`;
            }
        });
        results.push({
            [`查看题目 ${problem_id} 的个人提交记录`]: () => {
                unsafeWindow.location.href = `/record/list?pid=${problem_id}&user=${userName}&page=1`;
            }
        })
    }


    return results;
}

function showResults(command:string, resultList: HTMLElement, panel: HTMLElement) {
    let results = getResults(command);
    resultList.innerHTML = '';
    results.forEach(result => {
        const li = unsafeWindow.document.createElement('li');
        li.textContent = Object.keys(result)[0];
        li.style.cssText = `
            padding: 5px;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        li.addEventListener('click', () => {
            result[Object.keys(result)[0]]();
            panel.remove();
            unsafeWindow.document.body.dataset.cmdPanel = '';
        });
        resultList.appendChild(li);
    });
}

function openCommandPanel() {
    if (unsafeWindow.document.body.dataset.cmdPanel) return;
    unsafeWindow.document.body.dataset.cmdPanel = 'true';

    const style = unsafeWindow.document.createElement('style');
    style.textContent = `
        #luguo-command-panel ul li:hover {
            background-color: #f5f5f5;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
    `;
    unsafeWindow.document.head.appendChild(style);

    const panel = unsafeWindow.document.createElement('div');
    panel.id = 'luguo-command-panel';
    panel.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    unsafeWindow.document.body.append(panel);

    const input = unsafeWindow.document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入命令...';
    input.style.cssText = `
        width: 300px;
        padding: 10px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        position: relative;
        top: -10%;
    `;
    input.addEventListener('keyup', () => {
        const command = input.value.trim();
        showResults(command, resultList, panel);
    });
    panel.appendChild(input);

    input.focus();

    // input.addEventListener('blur', () => {
    //     panel.remove();
    //     unsafeWindow.document.body.dataset.cmdPanel = '';
    // });

    const resultList = unsafeWindow.document.createElement('ul');
    resultList.style.cssText = `
        list-style-type: none;
        margin: 0;
        padding: 5px 0;
        background-color: white;
        width: 300px;
        border-radius: 5px;
        position: absolute;
        top: calc(50% - 10% + 40px);
        left: 50%;
        transform: translateX(-50%);
        max-height: 200px;
        overflow-y: auto;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    `;


    panel.appendChild(resultList);

    showResults('', resultList, panel);
}

export function onDoubleShift() {
    openCommandPanel();
}