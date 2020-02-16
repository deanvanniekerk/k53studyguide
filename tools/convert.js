const { contentData } = require("./data/content");
const { translations } = require("./data/strings");
const fs = require('fs');

const output = {};

const contentKeys = Object.keys(contentData);

contentKeys.forEach(key => {
    
    const data = contentData[key];

    data.forEach((d, i) => {

        const headingKey = `${key}.${i}.heading`;
        const descriptionKey = `${key}.${i}.description`;

        output[headingKey] = {
            en: d.heading
        };
        output[descriptionKey] = {
            en: d.description
        };

        d.heading = headingKey;
        d.description = descriptionKey;
    })

});

const tKeys = Object.keys(translations);

tKeys.forEach(key => {
    
    if(output[key] )
        console.log(output[key] );

    output[key] = {
        en: translations[key]
    };

});

fs.writeFileSync('./output/translations.ts', `export default ${JSON.stringify(output, null, 4)}`);
fs.writeFileSync('./output/content.ts', `const contentData = ${JSON.stringify(contentData, null, 4)}`);