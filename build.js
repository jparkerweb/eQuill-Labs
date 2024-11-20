const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register partials
const partialsDir = path.join(__dirname, 'src/templates/partials');
const partialFiles = fs.readdirSync(partialsDir);
partialFiles.forEach(file => {
    const partialName = path.parse(file).name;
    const partialContent = fs.readFileSync(path.join(partialsDir, file), 'utf8');
    Handlebars.registerPartial(partialName, partialContent);
});

// Load layouts
const layoutsDir = path.join(__dirname, 'src/templates/layouts');
const layouts = {};
fs.readdirSync(layoutsDir).forEach(file => {
    const layoutName = path.parse(file).name;
    const layoutContent = fs.readFileSync(path.join(layoutsDir, file), 'utf8');
    layouts[layoutName] = Handlebars.compile(layoutContent);
});

// Process pages
function processDirectory(sourceDir, targetDir, relativePath = '') {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file.replace('.hbs', '.html'));
        const stats = fs.statSync(sourcePath);

        if (stats.isDirectory()) {
            processDirectory(sourcePath, targetPath, path.join(relativePath, file));
        } else if (file.endsWith('.hbs')) {
            const content = fs.readFileSync(sourcePath, 'utf8');
            const [frontmatter, ...contentParts] = content.split('---\n').filter(Boolean);
            const pageContent = contentParts.join('---\n');

            // Parse frontmatter
            const metadata = {};
            frontmatter.split('\n').forEach(line => {
                const [key, value] = line.split(': ').map(s => s.trim());
                if (key && value) metadata[key] = value;
            });

            // Calculate relative path to root
            const depth = relativePath.split(path.sep).filter(Boolean).length;
            metadata.relative = depth > 0 ? '../'.repeat(depth) : './';

            // Compile page content
            const pageTemplate = Handlebars.compile(pageContent);
            const renderedContent = pageTemplate(metadata);

            // Use specified layout or default
            const layoutName = metadata.layout || 'default';
            const layoutTemplate = layouts[layoutName];
            if (!layoutTemplate) {
                console.warn(`Layout "${layoutName}" not found, falling back to default`);
            }
            const finalContent = (layoutTemplate || layouts.default)({
                ...metadata,
                body: renderedContent
            });

            fs.writeFileSync(targetPath, finalContent);
        }
    });
}

// Recursively copy a directory
function copyDir(sourceDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
        const sourcePath = path.join(sourceDir, file);
        const targetPath = path.join(targetDir, file);
        
        if (fs.statSync(sourcePath).isDirectory()) {
            copyDir(sourcePath, targetPath);
        } else {
            fs.copyFileSync(sourcePath, targetPath);
        }
    });
}

// Copy static files to root of pages directory
function copyStaticFiles(source, target) {
    ['css', 'js', 'images'].forEach(dir => {
        const sourceDir = path.join(source, dir);
        const targetDir = path.join(target, dir);

        if (fs.existsSync(sourceDir)) {
            copyDir(sourceDir, targetDir);
        }
    });
}

// Build site
const pagesDir = path.join(__dirname, 'src/templates/pages');
const outputDir = path.join(__dirname, 'pages');
const staticDir = path.join(__dirname, 'src/static');

// Clear output directory with retry
function clearDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    try {
        fs.rmSync(dir, { recursive: true, force: true });
    } catch (err) {
        if (err.code === 'EBUSY') {
            console.log('Directory busy, retrying in 1 second...');
            setTimeout(() => {
                try {
                    fs.rmSync(dir, { recursive: true, force: true });
                } catch (retryErr) {
                    console.error('Could not clear directory, proceeding with build anyway');
                }
            }, 1000);
        } else {
            throw err;
        }
    }
}

// Build the site
clearDirectory(outputDir);
fs.mkdirSync(outputDir, { recursive: true });
processDirectory(pagesDir, outputDir);
copyStaticFiles(staticDir, outputDir);

console.log('Site built successfully!');
