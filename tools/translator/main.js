const fs = require('fs');
const { translations } = require("./input/translations");

const key = '';

const { Translate } = require('@google-cloud/translate').v2;

const translate = new Translate({ key: key });

const crunch = async () => {

    const keys = Object.keys(translations);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const translation = translations[key];


        console.log(``);
        console.log(`=================================`);

        console.log(`key: ${key}`);

        console.log(`---------------------------------`);

        try {

            let t = "";


            delete translation.af
            delete translation.zu
            delete translation.xh
            /*
            //Afrikaans 
            if (!translation.af) {
                [t] = await translate.translate(translation.en, { from: 'en', to: 'af' });
                console.log(`af: ${t.substring(0, Math.min(20, t.length - 1))}`);
                translation.af = t;
            }

            //Zulu 
            if (!translation.zu) {
                [t] = await translate.translate(translation.en, { from: 'en', to: 'zu' });
                console.log(`zu: ${t.substring(0, Math.min(20, t.length - 1))}`);
                translation.zu = t;
            }

            //Xhosa 
            if (!translation.xh) {
                [t] = await translate.translate(translation.en, { from: 'en', to: 'xh' });
                console.log(`xh: ${t.substring(0, Math.min(20, t.length - 1))}`);
                translation.xh = t;
            }
            */

        }
        catch (error) {
            console.error(error);
        }
    }

    fs.writeFileSync('./output/translations.ts', `
import { Translations } from "./";

const translations: Translations = ${JSON.stringify(translations, null, 4)}

export { translations };
`);
}

crunch();






