//var fs = require("fs");
//var stdinBuffer = fs.readFileSync("./sales1M.csv"); // STDIN_FILENO = 0
//var csv = stdinBuffer.toString();

function csv2arr(str, dlm) {
	"use strict";
	dlm = (dlm || ',').charCodeAt(0);

	var ROW = 0,
	    COL = 1,
	    QOT = 2,
		ESC = 3,
	    CR  = 4,
		END = 5,
		STOP = 6,
		pushcol  = 0,
		pushrow  = 1,
		pushesc  = 2,
		startcol = 3,
		startqot = 4,
		skipchar = 5,
		pushqot = 6,
		dft = 0,
		cqot = '"',
		qot = cqot.charCodeAt(0),
		cr = '\r'.charCodeAt(0),
		lf = '\n'.charCodeAt(0),
		i = 0,
		j = 0,
	    st = ROW,
	    row = [],
		col = '',
		res = [],
		fn,
		c,
		parstbl = [];

	parstbl[ROW] = [];
	parstbl[COL] = [];
	parstbl[QOT] = [];
	parstbl[ESC] = [];
	parstbl[CR ] = [];
	parstbl[END] = [];

	var trow = parstbl[ROW],
		tcol = parstbl[COL],
		tqot = parstbl[QOT],
		tesc = parstbl[ESC],
		tcr  = parstbl[CR],
		tend = parstbl[END];

	trow[qot] = [QOT, startqot];
	trow[dlm] = [ROW, pushcol ];
	trow[cr]  = [CR,  pushrow ];
	trow[dft] = [COL, startcol];

	tcol[dlm] = [ROW, pushcol ];
	tcol[lf]  = [ROW, pushrow ];
	tcol[cr]  = [CR,  pushrow ];
	tcol[dft] = [COL, skipchar];

	tqot[qot] = [ESC, pushqot ];
	tqot[dft] = [QOT, skipchar];
	
	tesc[qot] = [QOT, pushesc ];
	tesc[lf]  = [ROW, pushrow ];
	tesc[cr]  = [CR,  pushrow ];
	tesc[dlm] = [ROW, pushcol ];

	tcr[lf]   = [ROW, skipchar];
	tcr[cr]   = [CR,  pushrow ];
	tcr[dlm]  = [ROW, pushcol ];
	tcr[qot]  = [QOT, startqot];
	tcr[dft]  = [COL, startcol];

	tend[dft] = [STOP, pushrow];

	var tmp;
	while ((c = str.charCodeAt(i)) || (st !== STOP && (st = END))) {
		tmp = parstbl[st][c] || parstbl[st][dft];
		st = tmp[0];
		fn = tmp[1];

		switch (fn) {
		case pushcol:
		case pushrow:
			row.push(col || str.slice(j, i));
			j = ++i;
			col = '';
			if (fn === pushcol) break;
			res.push(row);
			row = [];
			break;
		case pushesc:
			col += cqot;
		case startqot:
			j = ++i;
			i = str.indexOf(cqot, i);
			if (i < 0)
				i = str.length;
			break;
		case pushqot:
			col += str.slice(j, i++);
			break;
		case startcol:
			j = i++;
			break;
		case skipchar:
			i++;
		}
	}
	return res;
}

var tsv='1\t2\t\t\n"ahoj ""jaa"""\t4\t5\n';
var csv='1,2,3\n5,6,7';
console.log(csv2arr(csv));

