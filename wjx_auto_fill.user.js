"use strict";
// ==UserScript==
// @name         WJX Auto Fill For XJTLU
// @version      1.1.0
// @description  Automatically fill in for XJTLU WJX Surveys
// @author       Peron
// @match        https://xjtlusurvey.wjx.cn/vm/*
// @grant        none
// ==/UserScript==
const waitForLoading = () => new Promise(resolve => {
    const loadedDiv = document.getElementsByClassName('ui-field-contain');
    if (loadedDiv.length)
        resolve(loadedDiv);
    else
        setTimeout(() => resolve(waitForLoading()));
});
(async () => {
    const allAnswers = new Set();
    // loop through all questions and answers in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key)
            allAnswers.add(localStorage.getItem(key));
    }
    for (const div of await waitForLoading()) {
        const label = div.getElementsByClassName('field-label')[0];
        const question = label.textContent?.trim() ?? '';
        const answer = localStorage.getItem(question);
        const options = [
            ...div.getElementsByClassName('ui-radio'),
            ...div.getElementsByClassName('ui-checkbox'),
        ];
        for (const option of options) {
            const optionContent = option.textContent?.trim();
            if (optionContent === answer || allAnswers.has(optionContent)) {
                option.click();
                allAnswers.delete(answer);
            }
            option.addEventListener('click', () => localStorage.setItem(question, optionContent));
        }
    }
})();
