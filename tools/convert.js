const { questionData } = require("./data/questions");
const { translations } = require("./data/translations");
const fs = require('fs');

const questionKeys = Object.keys(questionData);

let counter = 0;

questionKeys.forEach(key => {

    const data = questionData[key];

    data.forEach((question, index) => {

        const prefix = `${key}.question.${index}`;

        counter++;

        if (question.text.list) {

            const listItemKeys = [];
            question.text.list.forEach((listItem, i) => {
                const listItemTextKey = `${prefix}.text.list.${i}.text`;
                translations[listItemTextKey] = {
                    en: listItem
                };
                listItemKeys.push(listItemTextKey);
            });
            question.text.list = listItemKeys;

        }
        else {
            const textKey = `${prefix}.text`;
            translations[textKey] = {
                en: question.text
            };
            question.text = textKey;
        }

        question.option.forEach((option, i) => {
            const optionTextKey = `${prefix}.option.${i}.text`;
            translations[optionTextKey] = {
                en: option.value
            };
            option.value = optionTextKey;
        })

    })

});

console.log(counter);


fs.writeFileSync('./output/translations.ts', `
import { Translations } from "./";

const translations: Translations = ${JSON.stringify(translations, null, 4)}

export { translations };
`);
fs.writeFileSync('./output/questions.ts', `
import { QuestionData } from "./";

const questionData: QuestionData = ${JSON.stringify(questionData, null, 4)}

export { questionData };
`);