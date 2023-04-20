const fs = require('fs');
const cheerio = require('cheerio');
const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');
const csso = require('@node-minify/csso');

async function main() {
  // Minify Javascript
  var minifiedJs = await minify({
    compressor: terser,
    content: `${fs.readFileSync('../src/task-timer.js')}`
  });

  // Read the contents of the HTML file
  const html = fs.readFileSync('../src/index.html');

  // Load the HTML into a cheerio instance
  const $ = cheerio.load(html);

  // find style
  const css = $('style');

  // minify loaded CSS in-memory
  var minifiedCss = await minify({
    compressor: csso,
    content: `${css}`
  });

  // Find the existing script tag and replace its contents with the minified JavaScript
  $('script').replaceWith(`<script>${minifiedJs}</script>`);

  // Find the existing style tag and replace its contents with the minified CSS
  $('style').replaceWith(`<style>${minifiedCss}</style>`)

  // Generate the modified HTML document
  const newHtml = $.html();

  // Write the modified HTML to a file
  fs.writeFileSync('new-index.html', newHtml);
};

main();