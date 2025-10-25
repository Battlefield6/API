const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Configuration
const OUTPUT_DIR = '.wiki';
const BACKENDS_DIR = 'src/backends';
const MODELS_DIR = 'src/models';
const ENUMS_DIR = 'src/enums';

// Initialize project
const project = new Project({
    tsConfigFilePath: 'tsconfig.json'
});

// Helper: Clean output directory
function cleanOutputDir() {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'Backends'), { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'Models'), { recursive: true });
    fs.mkdirSync(path.join(OUTPUT_DIR, 'Enums'), { recursive: true });
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
    if (jsDocs.length > 0) {
        return jsDocs[0].getDescription().trim();
    }
    return '';
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

// Helper: Format method parameters as table
function formatParameters(method) {
    const params = method.getParameters();
    if (params.length === 0) return '';

    let result = '\n\n**Parameters:**\n\n';
    result += '| Name | Type | Description |\n';
    result += '|------|------|-------------|\n';

    for (const param of params) {
        const name = param.getName();
        const type = cleanTypeString(param.getType().getText());
        const optional = param.isOptional() ? ' *(optional)*' : '';
        const defaultValue = param.getInitializer() ? ` (default: \`${param.getInitializer().getText()}\`)` : '';
        const description = getParamDescription(method, name) || '-';

        result += `| \`${name}\`${optional} | \`${type}\` | ${description}${defaultValue} |\n`;
    }

    return result;
}

// Helper: Format return type
function formatReturnType(method) {
    const returnType = cleanTypeString(method.getReturnType().getText());
    if (returnType === 'void') return '';
    return `\n\n**Returns:** \`${returnType}\``;
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
            return `\n\n**Example:**\n\n\`\`\`typescript\n${exampleContent.trim()}\n\`\`\`\n`;
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
    if (!className) return null;

    // Skip if @ignore is present
    if (hasJsDocTag(cls, 'ignore')) return null;

    const description = getJsDocComment(cls);
    const author = getJsDocTag(cls, 'author');
    const since = getJsDocTag(cls, 'since');

    let clazz = false;
    let markdown = ''; //`# ${className}\n\n`;

    if (description) {
        markdown += `${description}\n\n`;
        clazz = true;
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
        markdown += `\`\`\`typescript\nnew ${className}(${constructor.getParameters().map(p => p.getName()).join(', ')})\n\`\`\`\n`;
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
            const methodName = method.getName();
            const methodDesc = getJsDocComment(method);
            const isAsync = method.isAsync();

            const params = method.getParameters().map(p => {
                const name = p.getName();
                const optional = p.isOptional() ? '?' : '';
                return `${name}${optional}`;
            }).join(', ');

            const returnType = cleanTypeString(method.getReturnType().getText(), true);

            markdown += `-----\n\n`;
            markdown += `## \`${methodName}(${params}): ${returnType}\`\n\n`;

            if (methodDesc) {
                markdown += `> ${methodDesc}\n\n`;
            }

            markdown += formatParameters(method);
            markdown += formatReturnType(method);

            markdown += `---\n\n`;
            // Load example if exists
            markdown += loadExample(className, methodName);

            markdown += `\n\n`;
        }
    }

    return { name: className, content: markdown };
}

// Generate documentation for an enum
function generateEnumDoc(enumDecl) {
    const enumName = enumDecl.getName();

    // Skip if @ignore is present
    if (hasJsDocTag(enumDecl, 'ignore')) return null;

    const description = getJsDocComment(enumDecl);
    const author = getJsDocTag(enumDecl, 'author');
    const since = getJsDocTag(enumDecl, 'since');

    let markdown = `# ${enumName}\n\n`;

    if (description) {
        markdown += `${description}\n\n`;
    }

    if (author || since) {
        markdown += `---\n\n`;
        if (author) markdown += `**Author:** ${author}\n\n`;
        if (since) markdown += `**Since:** ${since}\n\n`;
    }

    markdown += `## Values\n\n`;

    const members = enumDecl.getMembers();
    for (const member of members) {
        const name = member.getName();
        const value = member.getValue();
        const memberDesc = getJsDocComment(member);

        markdown += `### ${name}\n\n`;
        if (memberDesc) {
            markdown += `${memberDesc}\n\n`;
        }
        if (value !== undefined) {
            markdown += `**Value:** \`${value}\`\n\n`;
        }
    }

    return { name: enumName, content: markdown };
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

    let sidebar = `# Documentation\n\n`;

    if (backends.length > 0) {
        sidebar += `## Backends\n\n`;
        backends.sort((a, b) => a.name.localeCompare(b.name));
        for (const backend of backends) {
            sidebar += `- [${backend.name}](Backends/${backend.name}.md)\n`;
        }
        sidebar += `\n`;
    }

    if (models.length > 0) {
        sidebar += `## Models\n\n`;
        models.sort((a, b) => a.name.localeCompare(b.name));
        for (const model of models) {
            sidebar += `- [${model.name}](Models/${model.name}.md)\n`;
        }
        sidebar += `\n`;
    }

    if (enums.length > 0) {
        sidebar += `## Enums\n\n`;
        enums.sort((a, b) => a.name.localeCompare(b.name));
        for (const enumDoc of enums) {
            sidebar += `- [${enumDoc.name}](Enums/${enumDoc.name}.md)\n`;
        }
        sidebar += `\n`;
    }

    fs.writeFileSync(path.join(OUTPUT_DIR, '_Sidebar.md'), sidebar);
}

// Main execution
function main() {
    console.log('Starting documentation generation...');

    cleanOutputDir();

    const backends = processBackends();
    const models = processModels();
    const enums = processEnums();

    generateSidebar(backends, models, enums);

    console.log(`\nDocumentation generated successfully!`);
    console.log(`- Backends: ${backends.length}`);
    console.log(`- Models: ${models.length}`);
    console.log(`- Enums: ${enums.length}`);
    console.log(`\nOutput directory: ${OUTPUT_DIR}/`);
}

main();
