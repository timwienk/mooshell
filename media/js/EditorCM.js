/*
 Class: MooshellEditor 
 Editor using CodeMirror
 http://marijn.haverbeke.nl/codemirror/index.html
 */

var MooShellEditor = new Class({
	Implements: [Options, Events, Class.Occlude],
	parameter: "Editor",
	options: {
		useCodeMirror: true,
		codeMirrorOptions: {
		}
	},
	initialize: function(el, options) {
		this.element = document.id(el);
		this.element.hide();
		if (this.occlude()) return this.occluded; 
		this.setOptions(options);
		
		this.editorLabelFX = new Fx.Tween(this.element.getParent('p').getElement('.editor_label'), {property: 'opacity'});
		if (this.options.useCodeMirror) {
			if (!this.options.codeMirrorOptions.stylesheet && this.options.stylesheet) {
				this.options.codeMirrorOptions.stylesheet = this.options.stylesheet.map( function(path) {
					return mediapath + path;
				});
			} 
			if (!this.options.codeMirrorOptions.path) {
				this.options.codeMirrorOptions.path = codemirrorpath + 'js/';
			}
			this.editor = CodeMirror.fromTextArea(
				this.element, this.options.codeMirrorOptions
			);
			this.element.hide();
			
		}
		this.element.getParent('p').addEvents({
			mouseenter: function() {
				this.editorLabelFX.start(0);
				//this.fullscreen.retrieve('fx').start(0.3);
			}.bind(this),
			mouseleave: function() {
				this.editorLabelFX.start(0.8);
				//this.fullscreen.retrieve('fx').start(0);
			}.bind(this)
		});
		Layout.registerEditor(this);	
	},
	updateFromMirror: function() {
		if (this.editor) this.element.set('value', this.editor.getCode());
	},
	hide: function() {
		if (this.editor) {
			this.element.hide();
			if (this.editor.frame) this.editor.frame.hide();
			return this.editor.frame;
		}
		return this.element.hide();
	},
	show: function() {
		if (this.editor) return this.editor.frame.show();
		return this.element.show();
	},
	setStyle: function(key, value) {
		if (this.editor) return this.editor.frame.setStyle(key, value);
		return this.element.setStyle(key, value);
	},
	setStyles: function(options) {
		if (this.editor) return this.editor.frame.setStyles(options);
		return this.element.setStyles(options);
	},
	getPosition: function() {
		if (this.editor) return this.editor.frame.getPosition();
		return this.element.getPosition();
	}
});


/*
 * JS specific settings
 */
MooShellEditor.JS = new Class({
	Extends: MooShellEditor,
	options: {
		name: 'js',
		useCodeMirror: true,
		flexibleHeight: true,
		stylesheet: [
			"css/codemirror/style.css", 
			"css/codemirror/jscolors.css"
		],
		codeMirrorOptions: {
			iframeClass: 'js',
			parserfile: ["tokenizejavascript.js", "parsejavascript.js"]
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
	}
});



/*
 * CSS specific settings
 */
MooShellEditor.CSS = new Class({
	Extends: MooShellEditor,
	options: {
		name: 'css',
		useCodeMirror: true,
		stylesheet: [
			"css/codemirror/style.css", 
			"css/codemirror/csscolors.css"
		],
		codeMirrorOptions: {
			iframeClass: 'css',
			parserfile: ["parsecss.js"]
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
	}
});


/*
 * HTML specific settings
 */
MooShellEditor.HTML = new Class({
	Extends: MooShellEditor,
	options: {
		name: 'html',
		useCodeMirror: true,
		stylesheet: [
			"css/codemirror/style.css", 
			"css/codemirror/xmlcolors.css"
		],
		codeMirrorOptions: {
			iframeClass: 'html',
			parserfile: ["parsexml.js"]
		}
	},
	initialize: function(el,options) {
		this.setOptions(options);
		this.parent(el,this.options);
	}
});