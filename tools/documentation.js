const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = '.wiki';
const BACKENDS_DIR = 'src/backends';
const MODELS_DIR = 'src/models';
const ENUMS_DIR = 'src/enums';

const BASE = 'https://github.com/Battlefield6/API/wiki/';
const INDENT = '⠀';
const ICON_MODEL = getIcon('Models.png');
const ICON_BACKEND = getIcon('Backend.png');
const ICON_ENUM = getIcon('Enumeration.png');
const ICON_EXPERIMENTAL = getIcon('Experimental.png');

// Initialize project
const project = new Project({
    tsConfigFilePath: 'tsconfig.json'
});

// Helper: Clean output directory
function cleanOutputDir() {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    for(let dest of [
        'Backends',
        'Models',
        'Enums'
    ]) {
        if (fs.existsSync(path.join(OUTPUT_DIR, dest))) {
            fs.rmSync(path.join(OUTPUT_DIR, dest), { recursive: true });
        }

        fs.mkdirSync(path.join(OUTPUT_DIR, dest), { recursive: true });
    }
}

// Helper: Extract JSDoc tags
function getJsDocTag(node, tagName) {
    const jsDocs = node.getJsDocs();
    for (const doc of jsDocs) {
        const tag = doc.getTags().find(t => t.getTagName() === tagName);
        if (tag) {
            return tag.getCommentText() || '';
        }
    }
    return '';
}

// Helper: Check if JSDoc tag exists
function hasJsDocTag(node, tagName) {
    const jsDocs = node.getJsDocs();
    for (const doc of jsDocs) {
        const tag = doc.getTags().find(t => t.getTagName() === tagName);
        if (tag) {
            return true;
        }
    }
    return false;
}

// Helper: Get full JSDoc comment
function getJsDocComment(node) {
    const jsDocs = node.getJsDocs();
    // Try to find the first JSDoc with a non-empty description
    for (const doc of jsDocs) {
        const description = doc.getDescription().trim();
        if (description) {
            return description;
        }
    }
    return '';
}

function fixHTML(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper: Clean up type strings
function cleanTypeString(typeStr, raw = false) {
    // Remove absolute paths and simplify imports
    // Example: import("E:/BF6/API/src/models/Blueprint").default[] => Blueprint[]
    typeStr = typeStr.replace(/import\("[^"]+\/([^/"]+)"\)\.default/g, '$1');

    // Remove remaining import statements with just the filename
    typeStr = typeStr.replace(/import\("[^"]+\/([^/"]+)"\)\.(\w+)/g, '$2');

    // Simplify remaining import statements
    typeStr = typeStr.replace(/import\([^)]+\)\./g, '');

    if(raw) {
        typeStr = typeStr.replace(/Promise\<([^\>]+)\>/g, '$1');
    }

    return typeStr;
}

// Helper: Get parameter description from JSDoc
function getParamDescription(method, paramName) {
    const jsDocs = method.getJsDocs();
    for (const doc of jsDocs) {
        const paramTags = doc.getTags().filter(t => t.getTagName() === 'param');
        for (const tag of paramTags) {
            const tagText = tag.getText();
            // Match @param {type} paramName description
            const match = tagText.match(/@param\s+(?:\{[^}]+\}\s+)?(\w+)\s+(.+)/);
            if (match && match[1] === paramName) {
                return match[2].trim();
            }
        }
    }
    return '';
}

function createTable(headers, data) {
    var table = '';

    table += '<table><thead><tr>';
    table += headers.map(header => `<th width="500px">${header}</th>`).join('');
    table += '</tr></thead><tbody><tr width="600px">';

    for(const row of data) {
        let entry = '<tr>';

        for(const cell of row) {
            entry += `<td valign="top">${cell}</td>`;
        }

        entry += '</tr>';

        table += entry;
    }

    table += '</tr></tbody></table>';

    return table;

}

// Helper: Format method parameters as table
function formatParameters(method) {
    const params = method.getParameters();

    if(params.length === 0) {
        return '';
    }

    let result = '\n\n###### Parameters\n\n';
    let data    = [];

    for(const param of params) {
        const name                  = param.getName();
        const type                  = cleanTypeString(param.getType().getText());
        const optional      = param.isOptional() ? ' <i>(optional)</i>' : '';
        const defaultValue  = param.getInitializer() ? ` (default: <code>${param.getInitializer().getText()}</code>)` : '';
        const description   = getParamDescription(method, name) || '';

        data.push([
            `<b>${name}</b>${optional}`,
            `<pre copy="false" lang="typescript">${type}</pre>`,
            `${description}${defaultValue}`
        ]);
    }

    result += createTable([
        'Name', 'Type', 'Description'
    ], data);

    return result;
}

// Helper: Format return type
function formatReturnType(method) {
    let returnType = cleanTypeString(method.getReturnType().getText());
    returnType = fixHTML(returnType);
    if (returnType === 'void') return '';
    return `\n\n###### Returns\n\n\<pre lang="typescript">${returnType}</pre>`;
}

// Helper: Load example for a method (case-insensitive)
function loadExample(className, methodName) {
    const examplesDir = path.join('examples', className);

    // Check if examples directory exists
    if (!fs.existsSync(examplesDir)) {
        return '';
    }

    // Get all files in the directory
    try {
        const files = fs.readdirSync(examplesDir);
        const targetFileName = `${methodName}.ts`.toLowerCase();

        // Find file case-insensitively
        const matchedFile = files.find(file => file.toLowerCase() === targetFileName);

        if (matchedFile) {
            const examplePath = path.join(examplesDir, matchedFile);
            const exampleContent = fs.readFileSync(examplePath, 'utf-8');
            return `\n\n###### Example\n\n\`\`\`typescript copy\n${exampleContent.trim()}\n\`\`\`\n`;
        }
    } catch (err) {
        // Directory doesn't exist or can't be read
        return '';
    }

    return '';
}

// Generate documentation for a class
function generateClassDoc(cls, category = '') {
    const className = cls.getName();
    let specials = [];

    if (!className) return null;

    // Skip if @ignore is present
    if (hasJsDocTag(cls, 'ignore')) return null;

    const description = getJsDocComment(cls);
    const author = getJsDocTag(cls, 'author');
    const since = getJsDocTag(cls, 'since');
    const requires = getJsDocTag(cls, 'requires');
    const experimental = hasJsDocTag(cls, 'experimental');

    let clazz = false;
    let markdown = ''; //`# ${className}\n\n`;

    if(description) {
        markdown += `${description}\n\n`;
        clazz = true;
    }

    if(experimental) {
        markdown += '> [!CAUTION]\n';
        markdown += `> ${ICON_EXPERIMENTAL} This is **Experimental**!\n\n`;
        specials.push('LABS');
    }

    if(requires) {
        let list = requires.split(',');

        markdown += '> [!IMPORTANT]\n';
        markdown += '> This Backend requires following **Account-Status**:\n';

        for(const item of list) {
            markdown += `> ${getIcon(item.trim() + '.png', item.trim())}\n`;

            if(item.includes(item)) {
                specials.push(item);
            }
        }

        markdown += `\n`;
    }

    if (author || since) {
        markdown += `---\n\n`;
        if (author) markdown += `**Author:** ${author}\n\n`;
        if (since) markdown += `**Since:** ${since}\n\n`;
    }

    // Constructor (skip if @hideconstructor is present)
    const constructor = cls.getConstructors()[0];
    if (!hasJsDocTag(cls, 'hideconstructor') && constructor && constructor.getParameters().length > 0) {
        clazz = true;
        markdown += `## Constructor\n\n`;
        markdown += `\`new ${className}(${constructor.getParameters().map(p => p.getName()).join(', ')})\`\n`;
        markdown += formatParameters(constructor);
        markdown += `\n\n`;
    }

    // Methods
    const methods = cls.getMethods().filter(m => {
        const scope = m.getScope();
        const isPublic = scope === undefined || scope.toString() === 'public';
        return isPublic && !hasJsDocTag(m, 'ignore');
    });

    if(methods.length > 0) {
        if(clazz) {
            markdown += `## Methods\n\n`;
        }

        for (const method of methods) {
            var methodOutput = '<details>';

            const methodName = method.getName();
            let methodDesc = getJsDocComment(method);
            const isAsync = method.isAsync();
            const params = method.getParameters().map(p => {
                const name = p.getName();
                const optional = p.isOptional() ? '?' : '';
                return `${name}${optional}`;
            }).join(', ');

            const returnType = cleanTypeString(method.getReturnType().getText(), true);

            const experimental = hasJsDocTag(method, 'experimental');
            if(experimental) {
                methodDesc = ICON_EXPERIMENTAL + methodDesc;
            }

            methodOutput += `<summary>${methodDesc}<pre lang="typescript">${methodName}(${params}): ${returnType}</pre></summary>`;

            methodOutput += formatParameters(method);
            methodOutput += formatReturnType(method);

            // Load example if exists
            methodOutput += loadExample(className, methodName);

            methodOutput += `\n\n`;
            methodOutput += `-----\n\n`;
            methodOutput += '</details>';

            markdown += methodOutput;
        }
    }

    return { name: className, content: markdown, special: specials };
}

// Helper: Escape description for table cell and convert lists to HTML
function escapeTableDescription(text) {
    if (!text) return '';

    // Split into lines
    const lines = text.split('\n').map(line => line.trim());

    let result = '';
    let inList = false;
    let listItems = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if line is a list item (starts with -, *, or (a), (b), etc.)
        const listMatch = line.match(/^[-*]\s+(.+)$/) || line.match(/^\([a-z]\)\s+(.+)$/);

        if (listMatch) {
            if (!inList) {
                inList = true;
                listItems = [];
            }
            listItems.push(listMatch[1]);
        } else {
            // Not a list item
            if (inList) {
                // Close the previous list
                result += '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
                inList = false;
                listItems = [];
            }

            if (line) {
                if (result) result += ' ';
                result += line;
            }
        }
    }

    // Close any remaining list
    if (inList) {
        result += '<ul>' + listItems.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }

    return result.trim();
}

// Generate documentation for an enum
function generateEnumDoc(enumDecl) {
    const enumName = enumDecl.getName();

    // Skip if @ignore is present
    if (hasJsDocTag(enumDecl, 'ignore')) return null;

    const description = getJsDocComment(enumDecl);
    const author = getJsDocTag(enumDecl, 'author');
    const since = getJsDocTag(enumDecl, 'since');

    let markdown = ''; //`# ${enumName}\n\n`;

    if (description) {
        markdown += `${description}\n\n`;
    }

    /*
    if (author || since) {
        markdown += `---\n\n`;
        if (author) markdown += `**Author:** ${author}\n\n`;
        if (since) markdown += `**Since:** ${since}\n\n`;
    }*/

    //markdown += `## Values\n\n`;

    const members = enumDecl.getMembers();
    let hasExceptions = false;

    for(const member of members) {
        if(hasExceptions) {
            break;
        }

        if(member.getJsDocs().length > 0) {
            if(hasJsDocTag(member, 'exception')) {
                hasExceptions = true;
                break;
            }
        }
    }

    if(hasExceptions) {
        markdown += '| Name | Exception | Description |\n';
        markdown += '|------|------|-------------|\n';
    } else {
        markdown += '| Name | Description |\n';
        markdown += '|------|-------------|\n';
    }

    for (const member of members) {
        const name = member.getName();
        const value = member.getValue();
        const memberDesc = getJsDocComment(member);
        const escapedDesc = escapeTableDescription(memberDesc) || '';

        if(hasExceptions) {
            let exception = getJsDocTag(member, 'exception');

            if(exception) {
                exception = `\`${exception}\``;
            }

            markdown += `| \`${enumName}.${name}\` | ${exception} | ${escapedDesc} |\n`;
        } else {
            markdown += `| \`${enumName}.${name}\` | ${escapedDesc} |\n`;
        }
    }

    return { name: enumName, content: markdown };
}

function getIcon(icon, tooltip = '') {
    var image = '';

    image += '<picture>';
    image += `<source media="(prefers-color-scheme: dark)" srcset="${BASE}Assets/Dark/Icons/${icon}#gh-dark-mode-only">`;
    image += `<img alt="" valign="middle" title="${tooltip}" src="${BASE}Assets/Light/Icons/${icon}">`;
    image += '</picture>';

    return image;
}

// Process Backends
function processBackends() {
    console.log('Processing Backends...');
    const backends = [];

    const backendFiles = fs.readdirSync(BACKENDS_DIR)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of backendFiles) {
        const filePath = path.join(BACKENDS_DIR, file);
        const sourceFile = project.getSourceFile(filePath);

        if (!sourceFile) continue;

        const classes = sourceFile.getClasses();
        for (const cls of classes) {
            const category = getJsDocTag(cls, 'category');
            if (category === 'Backends' || file.includes('Backend')) {
                const doc = generateClassDoc(cls, 'Backends');
                if (doc) {
                    backends.push(doc);
                    fs.writeFileSync(
                        path.join(OUTPUT_DIR, 'Backends', `${doc.name}.md`),
                        doc.content
                    );
                }
            }
        }
    }

    return backends;
}

// Process Models
function processModels() {
    console.log('Processing Models...');
    const models = [];

    if (!fs.existsSync(MODELS_DIR)) return models;

    const modelFiles = fs.readdirSync(MODELS_DIR)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of modelFiles) {
        const filePath = path.join(MODELS_DIR, file);
        const sourceFile = project.getSourceFile(filePath);

        if (!sourceFile) continue;

        const classes = sourceFile.getClasses();
        for (const cls of classes) {
            const doc = generateClassDoc(cls, 'Models');
            if (doc) {
                models.push(doc);
                fs.writeFileSync(
                    path.join(OUTPUT_DIR, 'Models', `${doc.name}.md`),
                    doc.content
                );
            }
        }
    }

    return models;
}

// Process Enums
function processEnums() {
    console.log('Processing Enums...');
    const enums = [];

    if (!fs.existsSync(ENUMS_DIR)) return enums;

    const enumFiles = fs.readdirSync(ENUMS_DIR)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of enumFiles) {
        const filePath = path.join(ENUMS_DIR, file);
        const sourceFile = project.getSourceFile(filePath);

        if (!sourceFile) continue;

        const enumDecls = sourceFile.getEnums();
        for (const enumDecl of enumDecls) {
            const doc = generateEnumDoc(enumDecl);
            if (doc) {
                enums.push(doc);
                fs.writeFileSync(
                    path.join(OUTPUT_DIR, 'Enums', `${doc.name}.md`),
                    doc.content
                );
            }
        }
    }

    return enums;
}

// Generate _Sidebar.md
function generateSidebar(backends, models, enums) {
    console.log('Generating _Sidebar.md...');

    let sidebar = '';

    sidebar += `<h6>General</h6>`;
    sidebar += `<p><small>The actual abstraction layer for retrieving or sending data from the portal server.</small></p>`;

    for(const site of [
        {
            name: 'Installation',
            icon: getIcon('Installation.png')
        }, {
            name: 'Usage',
            icon: getIcon('Settings.png')
        }, {
            name: 'Examples',
            icon: getIcon('Examples.png')
        }
    ]) {
        sidebar += `<p>${INDENT + INDENT}${site.icon} <a href="${site.name}">${site.name}</a></p>`;
    }

    if(backends.length > 0) {
        sidebar += `<h6>Backends</h6>`;
        sidebar += `<p><small>The actual abstraction layer for retrieving or sending data from the portal server.</small></p>`;
        backends.sort((a, b) => a.name.localeCompare(b.name));

        for(const backend of backends) {
            sidebar += '<p>';
            sidebar += `${INDENT + INDENT}${ICON_BACKEND} `;
            sidebar += `<a href="${backend.name}">${backend.name}</a>`;

            if(backend.special.length > 0) {
               if(backend.special.indexOf('VIP') !== -1) {
                   sidebar += INDENT + INDENT + getIcon('VIP.png', 'Account requires VIP!');
               }

                if(backend.special.indexOf('LABS') !== -1) {
                    sidebar += INDENT + INDENT + getIcon('Experimental.png', 'This is an experimental feature!');
                }
            }

            sidebar += '</p>';
        }
    }

    if(models.length > 0) {
        sidebar += `<h6>Models</h6>`;
        sidebar += `<p><small>Model data for simplified use of the data.</small></p>`;
        models.sort((a, b) => a.name.localeCompare(b.name));

        for(const model of models) {
            sidebar += `<p>${INDENT + INDENT}${ICON_MODEL} <a href="${model.name}">${model.name}</a></p>`;
        }
    }

    if(enums.length > 0) {
        sidebar += `<h6>Enum</h6>`;
        sidebar += `<p><small>Static data and informations.</small></p>`;
        enums.sort((a, b) => a.name.localeCompare(b.name));

        for(const enumDoc of enums) {
            sidebar += `<p>${INDENT + INDENT}${ICON_ENUM} <a href="${enumDoc.name}">${enumDoc.name}</a></p>`;
        }
    }

    sidebar += '<br />';

    fs.writeFileSync(path.join(OUTPUT_DIR, '_Sidebar.md'), sidebar);
}

// Generate Main.md
function generateMain(backends, models, enums) {
    console.log('Generating Main.md...');

    /* GENERAL */
    let general = '<h4>General</h4>';

    for(const site of [
        {
            name: 'Installation',
            icon: getIcon('Installation.png')
        }, {
            name: 'Usage',
            icon: getIcon('Settings.png')
        }, {
            name: 'Examples',
            icon: getIcon('Examples.png')
        }
    ]) {
        general += `<p>${INDENT + INDENT}${site.icon} <a href="${site.name}">${site.name}</a></p>`;
    }

    general += '<br />';

    /* EXAMPLES */
    let examples = '<h4>Examples</h4>';

    for(const site of [
        {
            name: 'Basic Setup',
            icon: ''
        }
    ]) {
        examples += `<p>${INDENT + INDENT}${site.icon} <a href="${site.name}">${site.name}</a></p>`;
    }

    /* Backends */
    let core = '<h4>Backends</h4>';

    if(backends.length > 0) {
        backends.sort((a, b) => a.name.localeCompare(b.name));

        for(const backend of backends) {
            core += '<p>';
            core += `${INDENT + INDENT}${ICON_BACKEND} `;
            core += `<a href="${backend.name}">${backend.name}</a>`;

            if(backend.special.length > 0) {
                if(backend.special.indexOf('VIP') !== -1) {
                    core += INDENT + INDENT + getIcon('VIP.png', 'Account requires VIP!');
                }

                if(backend.special.indexOf('LABS') !== -1) {
                    core += INDENT + INDENT + getIcon('Experimental.png', 'This is an experimental feature!');
                }
            }

            core += '</p>';
        }

        core += '<br />';
    }

    /* Models & Data */
    let data = '<h4>Models & Enums</h4>';

    if(models.length > 0) {
        models.sort((a, b) => a.name.localeCompare(b.name));

        for(const model of models) {
            data += `<p>${INDENT + INDENT}${ICON_MODEL} <a href="${model.name}">${model.name}</a></p>`;
        }
    }

    if(enums.length > 0) {
        enums.sort((a, b) => a.name.localeCompare(b.name));

        for(const enumDoc of enums) {
            data += `<p>${INDENT + INDENT}${ICON_ENUM} <a href="${enumDoc.name}">${enumDoc.name}</a></p>`;
        }
    }

    data += '<br />';

    fs.writeFileSync(path.join(OUTPUT_DIR, 'Home.md'), createTable([ '', '' ], [ [ general, examples ], [ core, data ] ]));
}

// Main execution
function main() {
    console.log('Starting documentation generation...');

    cleanOutputDir();

    const backends = processBackends();
    const models = processModels();
    const enums = processEnums();

    generateSidebar(backends, models, enums);
    generateMain(backends, models, enums);

    console.log(`\nDocumentation generated successfully!`);
    console.log(`- Backends: ${backends.length}`);
    console.log(`- Models: ${models.length}`);
    console.log(`- Enums: ${enums.length}`);
    console.log(`\nOutput directory: ${OUTPUT_DIR}/`);
}

main();
