function csv2arr(str, dlm) {
	"use strict";
	dlm = dlm || ',';

	var ROW = 0,
	    COL = 1,
	    QOT = 2,
		ESC = 3,
	    CR  = 4,
		END = 5,
		pushcol  = 0,
		pushrow  = 1,
		pushesc  = 2,
		startcol = 3,
		startqot = 4,
		skipchar = 5,
		pushqot = 6,
		qot = '"',
		i = 0,
		j = 0,
	    st = ROW,
	    row = [],
		col = '',
		res = [],
		fn,
		c;

	while ((c = str.charAt(i)) || (st = END)) {
		switch (st) {
		case ROW: switch (c) {
			case qot: st = QOT; fn = startqot; break;
			case dlm:           fn = pushcol;  break;
			case '\r':st = CR;  fn = pushrow;  break;
			default:  st = COL; fn = startcol; }
			break;
		case COL: switch (c) {
			case dlm:  st = ROW; fn = pushcol; break;
			case '\n': st = ROW; fn = pushrow; break;
			case '\r': st = CR;  fn = pushrow; break;
			default:             fn = skipchar; }
			break;
		case QOT: switch (c) {
			case qot: st = ESC; fn = pushqot; break;
			default:            fn = skipchar; }
			break;
		case ESC: switch (c) {
			case qot:  st = QOT; fn = pushesc; break;
			case '\n': st = ROW; fn = pushrow;  break;
			case '\r': st = CR;  fn = pushrow;  break;
			case dlm:  st = ROW; fn = pushcol;  break;
			default:   st = COL; fn = startcol;
			}
			break;
		case CR: switch (c) {
			case '\n': st = ROW; fn = skipchar; break;
			case '\r':           fn = pushrow;  break;
			case dlm:  st = ROW; fn = pushcol;  break;
			case qot:  st = QOT; fn = startqot; break;
			default:   st = COL; fn = startcol; }
			break;
		case END: fn = pushrow; END = 0; }

		switch (fn) {
		case pushcol:
		case pushrow:
			row.push(col || str.slice(j, i));
			j = ++i;
			col = '';
			if (fn === pushcol)
				break;
			res.push(row);
			row = [];
			break;
		case pushesc:
			col += qot;
		case startqot:
			j = ++i;
			i = str.indexOf(qot, i);
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

for (var i = 0; i < 100000; i++)
	csv2arr('0,2,3\r\n4,5,"ahoj ""a"" a"');

