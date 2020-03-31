# csv2arr.js

miniature (550 B gzipped) csv parser

## Usage

```html
<script src="csv2arr.min.js"></script>
<script>
	var csv = "1,2,\"Hello\"\n4,5,6";

	var res = csv2arr( csv );

	// res = [ [ "1", "2", "Hello" ], [ "4", "5", "6" ] ]
</script>
```

```js
var csv2arr = require( "./csv2arr.js" );

...
```
