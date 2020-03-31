/*
 * Terser task runner
 * (c) PanJarda 2020
 * 
 * TODO:
 * - arguments processing
 * - fs.watch for --watch option
 */

 var fs = require('fs'),
    Terser = require( "terser" ),
    config = require( "./terser-config.json" );

if ( !( "entry" in config ) ) {
	throw new Error( "'terser-config.json' has to specify file entries in 'entry' object." );
}

var entry = config.entry,
    path = config.output && config.output.path || ".", 
    filename = config.output && config.output.filename || "[name].min.js",
    out = null,
    result;

for ( var name in entry ) {
	out = path + "/" + filename.replace( "[name]", name );

	result = Terser.minify(
		fs.readFileSync( entry[ name ], "utf8" ),
		config.options
	);

	if ( result.error ) {
		process.stderr.write( result.error );
	}

	if ( result.warnings ) {
		result.warnings.forEach( function( warning ) {
			process.stdout.write( warning );
		})
	}

	fs.writeFileSync( out, result.code );

	process.stdout.write( entry[ name ] + " > " + out + "\n" );
}
