const fs = require('fs');
const files = [
    'projetos/cristal-terminal/index.html',
    'projetos/estudas-comigo/index.html',
    'projetos/gt-movel/index.html',
    'projetos/tec-n-cool/index.html'
];
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace listener with IIFE
    content = content.replace(/document\.addEventListener\("DOMContentLoaded", \(\) => {/g, '(function initGallery() {');
    
    // Add null check
    content = content.replace(/galleryContainer\.innerHTML = '';/g, 'if (!galleryContainer) return;\n                            galleryContainer.innerHTML = "";');
    
    // Replace ending }); with })();
    content = content.replace(/}\);\n(\s*<\/script>)/g, '})();\n$1');
    
    fs.writeFileSync(file, content);
    console.log('Fixed ' + file);
});
