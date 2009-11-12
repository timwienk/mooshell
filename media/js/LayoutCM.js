/*
 Layout using CodeMirror
 */


Element.implement({
	getInnerWidth: function() {
		return this.getSize().x - 
				this.getStyle('padding-left').toInt() - 
				this.getStyle('padding-right').toInt() -
				this.getStyle('border-left-width').toInt() -
				this.getStyle('border-right-width').toInt();
	},
	getInnerHeight: function() {
		return this.getSize().y - 
				this.getStyle('padding-top').toInt() -
				this.getStyle('padding-bottom').toInt() -
				this.getStyle('border-top-width').toInt() -
				this.getStyle('border-bottom-width').toInt();
	}
});

var Layout = {
	editors: $H({}),
	start: function () {
		
		// instantiate sidebar
		this.sidebar = new Sidebar({
			DOM: 'sidebar',
			onActive: function(){
				var self = this;
				// resize needed as accordion height may be changed and scrollbar may appear
				// add delay to make accordion set it's height
				return (function() {self.resize();}.delay(700));
			}.bind(this)
		});
		window.addEvent('resize', this.resizeWithDelay.bind(this));
		
		// set editor labels
		var result = document.id('result');
		$$('.editor_label').setStyle('opacity',0.8);
		if (result) {
			result.getElement('.editor_label').setStyle('opacity', 0.3);
			this.result = result.getElement('iframe');
		}
		
		// set appropriate classes to the first and the last action items
		var actions = document.id('actions');
		actions.getElement('a.collapsedActions').addClass('firstChild');
		actions.getElements('a.collapsedActions:last-child').addClass('lastChild');
		
		this.resizeWithDelay();
				
		this.fireEvent('ready');
	},
	registerEditor: function( editor ) {
		this.editors[editor.options.name] = editor;
		this.resize();
	},
	updateFromMirror: function() {
		this.editors.each( function(ed) {
			ed.updateFromMirror();
		});
	},
	cleanMirrors: function() {
		this.editors.each( function(ed) {
			ed.cleanMirror();
		});
	},
	resizeWithDelay: function() {
		this.resize();
		// sometimes size is counted with scrollbars (especially in webkit)
		// (function() { return this.resize(); }.bind(this) ).delay(3);
		// after scrollbars are removed - resize again to the right size
		 (function() { return this.resize(); }.bind(this) ).delay(10);
	},
	resize: function(e) {
		// there is a need to do some IE fixes
		var ie_offset = (Browser.Engine.trident) ? 2 : 0; 
		// hide results to measure the size of a window without them
		var height, window_size, offset, width, js, js_top, top;
		this.editors.each( function(ed) {
			ed.hide();
		});
		if (this.result) this.result.hide();
		
		window_size = window.getSize();
		// width of textareas and iframe
		offset = 10 + ie_offset; // options?
		width = Math.floor($('content').getInnerWidth() / 2) - offset;
		
		$$('fieldset p').setStyle('width', width + offset - ie_offset);

		// set all editors width
		this.editors.each( function(ed) {
			ed.show();
			ed.setStyle('width', width);
		});
		
		// get JS height
		if (this.editors.js) {
			js = this.editors.js;
			js_top = js.getPosition().y;
			height = window_size.y - js_top - offset;
			js.setStyle('height', height);
		}

		if (this.result) {
			this.result.show();
			if (!this.editors.js) {
				top = this.result.getPosition().y;
				height = window_size.y - top - offset;
			}
			this.result.setStyles({
				'height': height,
				'width': width 
			});
		}
		
		this.fireEvent('resize');
	}
};
// add events to Layout object
$extend(Layout, new Events());