// ==UserScript==
// @name         WJX Auto Fill For XJTLU
// @version      1.2.1
// @description  Automatically fill in for XJTLU WJX Surveys
// @author       Peron
// @match        https://xjtlusurvey.wjx.cn/vm/*
// @updateURL    https://raw.githubusercontent.com/PeronGH/xjtlu_wjx_auto_fill/main/wjx_auto_fill.user.js
// @downloadURL  https://raw.githubusercontent.com/PeronGH/xjtlu_wjx_auto_fill/main/wjx_auto_fill.user.js
// @grant        none
// ==/UserScript==

const waitForLoading: () => Promise<HTMLCollection> = () =>
    new Promise(resolve => {
        const loadedDiv = document.getElementsByClassName('ui-field-contain');
        if (loadedDiv.length) resolve(loadedDiv);
        else setTimeout(() => resolve(waitForLoading()));
    });

(async () => {
    const allAnswers = new Set();
    // loop through all questions and answers in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) allAnswers.add(localStorage.getItem(key));
    }

    for (const div of await waitForLoading()) {
        const label = div.getElementsByClassName('field-label')[0];
        const question = label.textContent?.trim() ?? '';
        const answer = localStorage.getItem(question);

        const options = [
            ...div.getElementsByClassName('ui-radio'),
            ...div.getElementsByClassName('ui-checkbox'),
        ] as HTMLDivElement[];

        for (const option of options) {
            const optionContent = option.textContent?.trim();

            if (optionContent === answer || allAnswers.has(optionContent))
                option.click();

            option.addEventListener('click', () =>
                localStorage.setItem(question, optionContent!)
            );
        }
    }
})();
