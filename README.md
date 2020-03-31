# parsecsv.js

miniature csv parser

## Usage

```html
<script src="parsecsv.js"></script>
<script>
	var csv = "1,2,3\n4,5,6";

	var res = parsecsv( csv );

	// res = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
</script>
```

```js
var parsecsv = require( "./parsecsv.js" );

...
```
