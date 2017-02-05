$(function() {
	var matches = window.location.href.match(/\/([a-z\._]*)/g);
	if (typeof matches[3] != 'undefined')
		var url = "http:/" + matches[1] + matches[2] + matches[3];
	else
		var url = "http:/" + matches[1] + matches[2];

	$('ul.nav a').each(function () {
		if (this.href == url)
			$(this).parent('li').addClass('active');
	});
});