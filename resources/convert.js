const fs = require("fs");
var sizeOf = require('image-size');


// CONTENT
let buffer = fs.readFileSync("./original/content.json");

let data = JSON.parse(buffer.toString("utf8"));

let output = data.reduce((p, c) => {
    if (c.Node.startsWith("rootNavigation.driver")) return p;

    const arr = c.Node.split(".");
    arr.splice(0, 2);

    const key = "nav." + arr.join(".");

    const d = {
        imageName: c.ImageName || "",
        heading: c.Heading,
        description: c.Description,
    };

    if (!p[key]) p[key] = [d];
    else p[key].push(d);

    return p;
}, {});

fs.writeFileSync("./content.json", JSON.stringify(output, null, 4));






// IMAGES
buffer = fs.readFileSync("./original/content.json");
data = JSON.parse(buffer.toString("utf8"));

output = data.reduce((p, c) => {
    if (!c.ImageName) return p;

    var dimensions = sizeOf(`./original/images/${c.ImageName}`);
    //console.log(dimensions);

    p = p + `"${c.ImageName}": {
        width: ${dimensions.width},
        height: ${dimensions.height},
        source: require('./${c.ImageName}'),
    },`

    return p;
}, "export const images = {");

output = output + "}"


fs.writeFileSync("./images.ts", output);



// NAV
const keys = Object.keys(output);
const parentChildLookup = {};

const loadParentChildLookup = () => {
    keys.forEach(key => {
        const sections = key.split(".");
        let parent = "";

        sections.forEach(section => {
            if (section === "nav") {
                parent = section;
                return;
            }

            const child = `${parent}.${section}`;

            if (parentChildLookup[parent]) {
                if (!parentChildLookup[parent].some(k => k == child))
                    parentChildLookup[parent].push(child);
            } else parentChildLookup[parent] = [child];

            parent = child;
        });
    });
};

loadParentChildLookup();

fs.writeFileSync("./navigationLookup.json", JSON.stringify(parentChildLookup, null, 4));





// STRINGS
buffer = fs.readFileSync("./original/strings.json");
data = JSON.parse(buffer.toString("utf8"));

const translations = {}

data.forEach(d => {

    if (!d.Name.startsWith("rootNavigation.learner"))
        return;

    translations[d.Name.replace("rootNavigation.learner", "nav")] = d.Value;
});

fs.writeFileSync("./strings.json", JSON.stringify(translations, null, 4));







//QUESTIONS
buffer = fs.readFileSync("./original/questions.json");
data = JSON.parse(buffer.toString("utf8"));

const questions = {}

data.forEach(d => {

    const nav = d.navPath.replace("rootNavigation.learner", "nav");

    questions[nav] = Array.isArray(d.question) ? d.question : [d.question];
});

fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 4));