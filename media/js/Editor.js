/*
 * Add PostEditor (and possibly other) functionality to the textareas
 */
var MooShellEditor = new Class({
	Extends: PostEditor,
	options: {
		tab: '  ',
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.tab = this.options.tab;
		this.parent(el,this.options);
		this.editorLabelFX = new Fx.Tween(this.element.getParent('p').getElement('.editor_label'))
		this.element.addEvents({
			focus: function() {
				this.editorLabelFX.start('opacity',0.15);
			}.bind(this),
			blur: function() {
				this.editorLabelFX.start('opacity',1);
			}.bind(this)
		});
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
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.js_edit = this;
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
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.css_edit = this;
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
		this.setOptions(options);
		this.parent(el,this.options);
		Layout.html_edit = this;
	}
});