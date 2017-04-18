module.exports = function (envData, projectData, global) {
    return {
        pageTitle: 'menu',
        privateCSS: [
            `${projectData.__PROJECT_PREFIX__}menu.css`,
        ].map(function(url) {
            return `<link rel="stylesheet" href="${url}">`
        }).join(''),

        privateJS: [
            `${projectData.__PROJECT_PREFIX__}menu.js`,
        ].map(function(url) {
            return `<script src="${url}"></script>\n    `
        }).join(''),
    }
}
