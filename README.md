#simple-momentpicker
[![Circle CI](https://circleci.com/gh/mycolorway/simple-momentpicker.png?circle-token= a8f56261048d7fd84862e210b7e3b884f4ac4166)](https://circleci.com/gh/mycolorway/simple-momentpicker)


A simple, swift and customizable date/time picker based on [simple-module](https://github.com/mycolorway/simple-module)

Designed for both mouse and keyboard intereaction.

## Quick start

1. Download the latest [release](https://github.com/mycolorway/simple-momentpicker/releases), or via [Bower](http://bower.io/).

	You should also get these dependencies: [jQuery](https://jquery.com/), [momentjs](http://momentjs.com/) and [simple-module](https://github.com/mycolorway/simple-module)

2. Import js/css file to your code

	```
	<link rel="stylesheet" href="path/to/momentpicker.css"/>

	<script type="text/javascript" src="path/to/jquery.js"></script>
	<script type="text/javascript" src="path/to/module.js"></script>
	<script type="text/javascript" src="path/to/moment.js"></script>
	<script type="text/javascript" src="path/to/momentpicker.js"></script>

	```
	
	The plugin can also be loaded as AMD or CommonJS module.

3. Then you can run it like:

	```
	 simple.momentpicker({
       el: '#time'
    });
	
	```
	
## Configuration options
el: null
    inline: false
    valueFormat: 'YYYY-MM-DD HH:mm:ss'
    formatSplit: ' '
    cls: ''
    viewOpts:
      date:
        disableBefore: null
        disableAfter: null

| Option        | Value                  | Default                                                            | Description                                                                                                                       |
|---------------|------------------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| el            | selector/jQuery Obejct | null                                                               | a input element to initial momentpicker, necessary                                                                                |
| inline        | boolean                | false                                                              | if set true, will append momentpicker after el                                                                                    |
| valueFormat   | string                 | 'YYYY-MM-DD HH:mm'                                                 | momentjs's format string, set input's value format                                                                                |
| displayFormat | string                 | 'YYYY-MM-DD HH:mm'                                                 | momentjs's format string, set input's display format, only available when inline false                                            |
| formatSplit   | string                 | ' '                                                                | A split sign for displayFormat to differentiate date and time view                                                               |
| cls         | string                 | 'datetime-picker'                                                  | the class name add to momentpicker dom                                                                                            |
| viewOpts      | obejct                 | -                                                                  | the options passed to views, only date's disableBefore and disableAfter provided                                                  |                                                            |

Please refer to demo to get more details.
 
## Method and Event

### Instance Method

- setMoment()
	
	set momentpicker's date, could be date string or moment obeject.

- getMoment()

	get a clone of momentpicker's moment

- getValue()

	get value of momentpicker
	
- destroy()

	destroy momentpicker, reset all.
	
	
### Event

- select

	triggered when selected a date/time, the only argument is an event object.
	