const { parallel, src, dest } = require('gulp');
var prettyHtml = require('gulp-pretty-html');
const gulpStylelint = require('gulp-stylelint');

function html() {
    return src('_site/**/*.html', { base: './' })
        .pipe(prettyHtml({
            preserve_newlines: false
        }))
        .pipe(dest('./'));
}
function css() {
    return src('_site/**/*.css', { base: './' })
    .pipe(gulpStylelint({
        reporters: [
            { formatter: 'string', console: true, fix: true }
        ]
    }));

}

exports.default = parallel(html, css);
exports.html = html;
exports.css = css;