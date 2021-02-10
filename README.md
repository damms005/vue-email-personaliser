# vue-email-personaliser
![Art for vue-email-personaliser](https://banners.beyondco.de/vue-email-personaliser.png?theme=light&packageManager=npm+install&packageName=vue-email-personaliser&pattern=formalInvitation&style=style_1&description=Personalise+email+messages+from+CSV+data+using+moustache+syntax+and+the+power+of+Vue+JS%21&md=1&showWatermark=1&fontSize=100px&images=tag&widths=350)

[Vue Web Component](https://cli.vuejs.org/guide/build-targets.html#web-component) for formatting email message based on CSV file content). Sample backend (Laravel package): [laravel-personalised-email-sender](https://github.com/damms005/laravel-personalised-email-sender)

The general workflow in using this Vue component is:
- Paste details of your email recipients in CSV format (actually, TSV, for now :)). The first row are parsed as header/placeholders
- Format the email you wish to send (use {{mustache}} syntax to dynamically inject data from the CSV pasted above. The CSV headers serve as placeholders)
- Check the rendered sample email message in the Preview box to be sure your formatted mail looks the way you want it
- Specify your backend endpoint that handles the actual sending of the email messages (see sample implementation [here](https://github.com/damms005/laravel-personalised-email-sender). You can actually simply use [laravel-personalised-email-sender](https://github.com/damms005/laravel-personalised-email-sender)) as your backend end-point
- Specify the index of the column that your endpoint will uniquely use to identify each row
- Send it!

## Usage
### As a web browser drop-in Vue component
The `/dist` folder contains this package's [Vue Web Component](https://cli.vuejs.org/guide/build-targets.html#app) built with the `--inline-vue` flag (see more details in the `package.json` file). This means that you can immediately start using this package as a Vue component by simply importing it into your web page like below:

```
<script src='dist/vue-email-personaliser.min.js'></script>
```

This will provide you with a Vue component as `<vue-email-personaliser></vue-email-personaliser>`. This component accepts a `prop` named `default-post-endpoint`, which you use to specify the endpoint that will do the actual sending out of your email (e.g. as implemented in [laravel-personalised-email-sender](https://github.com/damms005/laravel-personalised-email-sender)). The formatted email template will be `POST`ed to this endpoint.

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

- Write tests
- Improve README to have more practical example (screenshot?)

## Learning resources

- https://www.codementor.io/@martinaimar/web-components-with-vue-cli-3-t1bduun66
- https://cli.vuejs.org/guide/build-targets.html#web-component
- https://medium.com/mounoydev/vue-component-rich-text-editor-wysiwyg-59b57052d5b3
