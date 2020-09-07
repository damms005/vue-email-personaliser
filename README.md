# laravue-mailer-js

[Vue Web Component](https://cli.vuejs.org/guide/build-targets.html#web-component) for formatting email message based on CSV file content. Sample backend (Laravel package): https://github.com/damms005/laravue-mailer

## Usage

- Link the compiled js and css files in the `dist` folder to your html file, i.e.:

```
<script src='dist/assets/css/app.css'></script>
...
...
...
<script src='dist/assets/js/app.js'></script>
```

- In your code, use the custom Vue component ``

## Development

If you are interested in having a dev version of this project (e.g. for customization), `cd` to the project root and run the following commands:

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your tests

```
npm run test
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Todo

- Tree-shake unused TailwindCss styles
- Make this readme more meaningful/easier
- Write tests
- Make package modular (so can be npm installed)

## Learning resources

- https://www.codementor.io/@martinaimar/web-components-with-vue-cli-3-t1bduun66
- https://cli.vuejs.org/guide/build-targets.html#web-component
- https://github.com/m3esma/vue-easy-tinymce (because at the moment, the official Tinymce Vue component does not work when Vue is built as web component)
- https://medium.com/mounoydev/vue-component-rich-text-editor-wysiwyg-59b57052d5b3
