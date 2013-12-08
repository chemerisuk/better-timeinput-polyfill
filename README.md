# better-timeinput-polyfill [![Build Status](https://api.travis-ci.org/chemerisuk/better-timeinput-polyfill.png?branch=master)](http://travis-ci.org/chemerisuk/better-timeinput-polyfill)
> `input[type=time]` polyfill for [better-dom](https://github.com/chemerisuk/better-dom)

[LIVE DEMO](http://chemerisuk.github.io/better-timeinput-polyfill/)

## Features
* does nothing on mobile browsers and normalizes the widget for desktop browsers
* [live extension](https://github.com/chemerisuk/better-dom/wiki/Live-extensions) - works for current and future content
* supports US variant of time with AM/PM selectbox (just use `lang="en-US"` on `<html>`)
* fully customizable via css classes
* restores initial value on parent form reset
* allows to set value programmatically, but the string should be in ISO (HH:mm) format

## Installing
Use [bower](http://bower.io/) to download this extension with all required dependencies.

    bower install better-timeinput-polyfill --save

This will clone the latest version of the __better-timeinput-polyfill__ into the `bower_components` directory at the root of your project.

Then append the following html elements on your page:

```html
<html>
<head>
    ...
    <link href="bower_components/better-timeinput-polyfill/dist/better-timeinput-polyfill.css" rel="stylesheet"/>
    <!--[if IE]>
        <link href="bower_components/better-dom/dist/better-dom-legacy.htc" rel="htc"/>
        <script src="bower_components/better-dom/dist/better-dom-legacy.js"></script>
    <![endif]-->
</head>
<body>
    ...
    <script src="bower_components/better-dom/dist/better-dom.js"></script>
    <script src="bower_components/better-timeinput-polyfill/dist/better-timeinput-polyfill.js"></script>
</body>
</html>
```

## Browser support
* Chrome
* Safari 6.0+
* Firefox 16+
* Opera 12.10+
* IE8+