#!/bin/sh

#clean and prepare publib directory
rm -rf public
cp -r src public

#compile jade to html
./node_modules/.bin/jade src -P
cd src
find . -name "*html" | cpio -pdvm ../public
cd ..
rm -rf src/*.html \
       src/**/*.html \
       public/**/_*.html \
       public/_partials

#compile sass to css
./node_modules/.bin/node-sass \
  --output-style compressed \
  --source-map-embed \
  src/_styles/main.scss public/css/main.css

#convert ES6 JS to ES5
./node_modules/.bin/babel src --out-dir public -s inline

#concat bower_components to public/lib directory
./node_modules/.bin/bowcat . -o public/lib -m

#clean unneeded files
rm -rf public/_styles \
       public/*.jade \
       public/**/*.jade \
       public/*.scss \
       public/**/*.scss
