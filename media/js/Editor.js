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
		//this.add_fullscreen_button();
		this.element.set('onpaste', 'Layout.resizeWithDelay();');
		this.element.addEvents({
			focus: function() {
				this.editorLabelFX.start('opacity',0.15);
				//this.fullscreen.retrieve('fx').start(0.3);
			}.bind(this),
			blur: function() {
				this.editorLabelFX.start('opacity',1);
				//this.fullscreen.retrieve('fx').start(0);
			}.bind(this),
		});
	},
	add_fullscreen_button: function() {
		this.fullscreen = new Element('a', {
			text: 'full screen',
			'class': 'fullscreen',
		})
			.inject(this.element,'after')
			.addEvents({
				'click': function(e) { e.stop(); alert('full screen'); },
				'mouseenter': function() { this.retrieve('fx').start(0.8); console.log('?')},
				'mouseleave': function() { this.retrieve('fx').start(0.3);}
			})
		this.fullscreen.store(
			'fx', 
			new Fx.Tween(this.fullscreen, {'property': 'opacity'}))

		this.fullscreen.retrieve('fx').set(0);
	},
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