function paste(e) {
	window.setTimeout(function(){
		var v = document.getElementsByTagName('textarea')[0].value.match(/(ttp|http|ttps|https)\:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+/ig);
		if(v && v.length) {
			for (var i = 0; i < v.length; ++i) {
				if (v[i].substring(0,3).toLowerCase() == 'ttp') {
					v[i] = 'h' + v[i];
				}
				chrome.tabs.create({url:v[i]});
			}
			window.close();
		} else {
			document.body.innerHTML = '<nobr>URL not found from your clipboard data.</nobr>';
		}
	}, 0);
}

window.onload = function () {
	var textarea = document.getElementsByTagName('textarea')[0];
	textarea.onpaste = paste;
	textarea.focus();
	document.execCommand('paste');
}
