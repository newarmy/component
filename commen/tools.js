define(function() {
	function get(e) {
		return document.querySelector(e);
	}
	function gets(e) {
		return document.querySelectorAll(e);
	}
	return {
		get: get,
		gets: gets
	};
});

