
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(config) {

  // A useful way to reference the context we are runing eleventy in
  let env = process.env.ELEVENTY_ENV;

  // Layout aliases can make templates more portable
  config.addLayoutAlias('default', 'layouts/base.njk');
  config.addLayoutAlias('home', 'layouts/home.njk');
  config.addLayoutAlias('static', 'layouts/static.njk');

  // add navigation data object
  config.addPlugin(eleventyNavigationPlugin);

  config.addFilter("pageNav", function(navigation, page, locale) {
    const pageNav = {
      back: null,
      next: null
    };

    let foundPage = false;

    const check = (entry) => {
      if (entry.url !== page.url && !foundPage) {
        pageNav.back = entry;
      }
      if (foundPage && pageNav.next === null) {
        pageNav.next = entry;
      }
      if (entry.url === page.url) {
        foundPage = true;
      }
    };

    navigation.forEach(nav => {
      if (nav.key === locale){
        nav.children.forEach(child => {
          check(child);
          child.children.forEach(entry => {
            check(entry);
          });
        });
      }
    });

    return pageNav;
  });

  // compress and combine js files
  config.addFilter("jsmin", function(code) {
    const UglifyJS = require("uglify-js");
    let minified = UglifyJS.minify(code);
      if( minified.error ) {
          console.log("UglifyJS error: ", minified.error);
          return code;
      }
      return minified.code;
  });

  // pass some assets right through
  config.addPassthroughCopy("./src/site/assets");
  config.addPassthroughCopy({"./src/site/_includes/roots" : "."});

  // make the seed target act like prod
  env = (env=="seed") ? "prod" : env;
  return {
    dir: {
      input: "src/site",
      output: "dist"
    },
    templateFormats : ["njk", "md", "11ty.js"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };

};