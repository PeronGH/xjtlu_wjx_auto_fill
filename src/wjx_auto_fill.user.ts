// ==UserScript==
// @name         WJX Auto Fill For XJTLU
// @version      1.0.1
// @description  Automatically fill in for XJTLU WJX Surveys
// @author       Peron
// @match        https://xjtlusurvey.wjx.cn/vm/*
// @grant        none
// ==/UserScript==

const answers = new Map<string, string>([
    ['苏康码颜色*', '绿色'],
    ['今日是否已做/将做核酸检测*', '是'],
    [
        '请注意：根据疾控要求，近6个月有新冠肺炎（确诊/疑似感染/无症状感染）史的人员须在核酸检测中实施单人单管。如你在近6个月内曾有感染史，请在核酸采样时告知采样人员需要单管（校内适用）。*',
        '已了解知悉。',
    ],
    ['你今日的防疫状态是否有异常？*', '无'],
    [
        '承诺书*【多选题】',
        '本人承诺所有填报信息、上传资料均为真实，如有隐瞒、漏报、谎报等行为，或者违反相关规定造成区域恐慌、疾病传播，自愿承担由此导致的相关法律及行政责任。',
    ],
    ['你在学校宿舍是否有床位*', '有'],
]);

async function waitForLoading(): Promise<HTMLCollection> {
    return new Promise(resolve => {
        const loadedDiv = document.getElementsByClassName('ui-field-contain');
        if (loadedDiv.length) resolve(loadedDiv);
        else setTimeout(() => resolve(waitForLoading()));
    });
}

(async () => {
    for (const div of await waitForLoading()) {
        const label = div.getElementsByClassName('field-label')[0];
        const question = label.textContent?.trim() ?? '';
        const answer = answers.get(question);

        if (answer) {
            const options = [
                ...div.getElementsByClassName('ui-radio'),
                ...div.getElementsByClassName('ui-checkbox'),
            ] as HTMLDivElement[];

            for (const option of options)
                if (option.textContent?.trim() === answer) option.click();
        }
    }
})();
