const fs = require('fs');
const cheerio = require('cheerio');
const minify = require('@node-minify/core');
const terser = require('@node-minify/terser');

async function main() {
  // Minify Javascript
  await minify({
    compressor: terser,
    input: '../src/task-timer.js',
    output: 'minifiedJs.js',
  });

  // Read the contents of the HTML file
  const html = fs.readFileSync('../src/index.html');

  // Load the HTML into a cheerio instance
  const $ = cheerio.load(html);

  // Find the existing script tag and replace its contents with the external JavaScript file
  $('script').replaceWith(`<script>${fs.readFileSync('minifiedJs.js')}</script>`);

  // Generate the modified HTML document
  const newHtml = $.html();

  // Write the modified HTML to a file
  fs.writeFileSync('new-index.html', newHtml);
};

main();