/* @flow */

function HtmlRemove() {}
HtmlRemove.prototype.apply = compiler => {
  compiler.plugin('compilation', compilation => {
    compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
      htmlPluginData.html = htmlPluginData.html.replace( // eslint-disable-line no-param-reassign
        /<!-- html:remove -->[\s\S]*?<!-- \/html:remove -->/g,
        ''
      );
      callback(null, htmlPluginData);
    });
  });
};

module.exports = HtmlRemove;
