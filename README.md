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

| Option        | Value                  | Default                                                            | Description                                                                                                                       |
|---------------|------------------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| el            | selector/jQuery Obejct | null                                                               | a input element to initial momentpicker, necessary                                                                                |
| list          | array                  | ['year','%-',,'month', '%-', 'date', '%,', 'hour', '%:', 'minute'] | set picker's selectable views, only year, month, date, hour, minute is provided, string begins with '%' will be converted to text |
| inline        | boolean                | false                                                              | if set true, will append momentpicker after el                                                                                    |
| valueFormat   | string                 | 'YYYY-MM-DD HH:mm'                                                 | momentjs's format string, set input's value format                                                                                |
| displayFormat | string                 | 'YYYY-MM-DD HH:mm'                                                 | momentjs's format string, set input's display format, only available when inline false                                            |
| defaultView   | string                 | 'auto'                                                             | default view when momentpicker shows                                                                                              |
| cls           | string                 | 'datetime-picker'                                                  | the class name add to momentpicker dom                                                                                            |
| viewOpts      | obejct                 | -                                                                  | the options passed to views, only date's disableBefore and disableAfter provided                                                  |                                                            |

To simplify configuration, we provide these method:

- **simple.momentpicker** initialize a datetime picker
- **simple.momentpicker.date** initialize a date picker
- **simple.momentpicker.month** initialize a month picker
- **simple.momtnpicker.time** initialize a time picker

Please refer to demo to get more details.
 
## Method and Event

### Instance Method

- setDate()
	
	set momentpicker's date, could be date string or moment obeject.
	
- clear()

	reset momentpicker's date.
	
- show()/hide()/toggle()

	controler momentpicker's show/hide.
	
- destroy()

	destroy momentpicker, reset all.
	
	
### Event

- select

	triggered when selected a date/time, the only argument is a moment object which represents selected date.
	