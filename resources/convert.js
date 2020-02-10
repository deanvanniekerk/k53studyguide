const fs = require("fs");

const buffer = fs.readFileSync("./contentOriginal.json");

const data = JSON.parse(buffer.toString("utf8"));

const output = data.reduce((p, c) => {
    if (c.Node.startsWith("rootNavigation.driver")) return p;

    const arr = c.Node.split(".");
    arr.splice(0, 2);

    const key = "nav." + arr.join(".");

    const d = {
        imageName: c.ImageName,
        heading: c.Heading,
        description: c.Description,
    };

    if (!p[key]) p[key] = [d];
    else p[key].push(d);

    return p;
}, {});

fs.writeFileSync("./content.json", JSON.stringify(output, null, 4));

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

function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

loadParentChildLookup();

fs.writeFileSync("./navigationLookup.json", JSON.stringify(parentChildLookup, null, 4));
