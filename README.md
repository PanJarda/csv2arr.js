# csv2arr.js

miniature (550 B gzipped) csv parser

## Usage

```html
<script src="csv2arr.js"></script>
<script>
	var csv = "1,2,3\n4,5,6";

	var res = csv2arr( csv );

	// res = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
</script>
```

```js
var parsecsv = require( "./csv2arr.js" );

...
```
