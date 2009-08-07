/*
 * Add PostEditor (and possibly other) functionality to the textareas
 */
var MooShellEditor = new Class({
	Extends: PostEditor,
	initialize: function(el,options) {
		this.parent(el,$merge(this.options, options));
	}
});

/*
 * JS specific settings
 */
MooShellEditor.JS = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			'(': ')',
			'{': '}',
			'[': ']',
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.parent(el,$merge(this.options, options));
	}
});


/*
 * CSS specific settings
 */
MooShellEditor.CSS = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			'{': '}',
			'[': ']',
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.parent(el,$merge(this.options, options));
	}
});


/*
 * HTML specific settings
 */
MooShellEditor.HTML = new Class({
	Extends: MooShellEditor,
	options: {			
		smartTypingPairs: {
			"'": "'"
		}
	},
	initialize: function(el,options) {
		this.parent(el,$merge(this.options, options));
	}
});