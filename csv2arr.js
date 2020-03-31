/**
 * csv2arr.js
 *
 * by: JP 2019
 * 
 * License MIT
 * 
 * 
 * Example:
 *     var res = csv2arr("1,2,3\n4,5,6");
 *     // res <-- [
 *     //             ['1', '2', '3'],
 *     //             ['4', '5', '6']
 *     //         ]
 */
( function( global, factory ) {
	"use strict";
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		module.exports = factory( global, true );
	} else {
		factory( global );
	}
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

	"use strict";

	var csv2arr = ( function() {
		var ERR_MISSING_QUOTE = "Missing quote",
		parstbl = {
			ROW: {
				'"':     ['QOT', startqot],
				',':     ['ROW', pushcol],
				'\r':    ['CR',  pushrow],
				default: ['COL', startcol]
			},
			COL: {
				',':     ['ROW', pushcol],
				'\n':    ['ROW', pushrow],
				'\r':    ['CR',  pushrow],
				default: ['COL', skipchar]
			},
			QOT: {
				'"':     ['ESC', pushesc],
				default: ['QOT', skipchar]
			},
			ESC: {
				'"':     ['QOT', startqot],
				'\n':    ['ROW', pushrow],
				'\r':    ['CR',  pushrow],
				',':     ['ROW', pushcol],
				default: ['COL', startcol]
			},
			CR: {
				'\n':    ['ROW', skipchar],
				'\r':    ['CR',  pushrow],
				',':     ['ROW', pushcol],
				'"':     ['QOT', startqot],
				default: ['COL', startcol]
			},
			END: {
				default: ['',    pushrow]
			}
		};
	
		function pushesc() {
			this.col += this.str.slice( this.j, this.i++ );
		}
		
		function pushcol() {
			this.row.push( this.col || this.str.slice( this.j, this.i ) );
			this.j = ++this.i;
			this.col = '';
		}
		
		function pushrow() {
			pushcol.call( this );
			this.res.push( this.row );
			this.row = [];
		}
		
		function skipchar() {
			this.i++;
		}
		
		function startcol() {
			this.j = this.i++;
		}
		
		function startqot() {
			this.j = ++this.i;
			this.i = this.str.indexOf( '"', this.i );
			if ( this.i < 0 ) {
				if ( window.console ) {
					if ( window.console.warn ) {
						console.warn( ERR_MISSING_QUOTE );
					} else {
						window.console.log( ERR_MISSING_QUOTE );
					}
				}
				this.i = this.str.length;
			}
		}
		
		function csv2arr( str ) {
			var action,
				c,
				o = {
					col: '',
					err: 0,
					i:   0,
					j:   0,
					str: str,
					res: [],
					row: []
				},
				state = "ROW",
				tmp;
			
			while ( c = str.charAt( o.i ) ) {
				tmp    = parstbl[ state ][ c ] || parstbl[ state ].default;
				state  = tmp[ 0 ];
				action = tmp[ 1 ];
				
				action.call( o );
			}
			
			parstbl.END.default[ 1 ].call( o );
			
			return o.res;
		};
		
		return csv2arr;
	})();

	if ( !noGlobal ) {
		window.csv2arr = csv2arr
	}

	return csv2arr;
});
