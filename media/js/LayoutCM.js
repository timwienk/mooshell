/*
 Layout using CodeMirror
 */


Element.implement({
	getInnerWidth: function() {
		return this.getSize().x 
				- this.getStyle('padding-left').toInt()
				- this.getStyle('padding-right').toInt()
				- this.getStyle('border-left-width').toInt()
				- this.getStyle('border-right-width').toInt()
	},
	getInnerHeight: function() {
		return this.getSize().y 
				- this.getStyle('padding-top').toInt()
				- this.getStyle('padding-bottom').toInt()
				- this.getStyle('border-top-width').toInt()
				- this.getStyle('border-bottom-width').toInt()
	}
});

var Layout = {
	editors: $H({}),
	start: function () {
		
		// instantiate sidebar
		this.sidebar = new Sidebar({
			DOM: 'sidebar',
			onActive: function(){
				var self = this
				// resize needed as accordion height may be changed and scrollbar may appear
				// add delay to make accordion set it's height
				return (function() {self.resize()}.delay(700));
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
	resizeWithDelay: function() {
		this.resize();
		// sometimes size is counted with scrollbars (especially in webkit)
		 (function() { return this.resize(); }.bind(this) ).delay(3);
		// after scrollbars are removed - resize again to the right size
		 (function() { return this.resize(); }.bind(this) ).delay(10);
	},
	resize: function(e) {
		// hide results to measure the size of a window without them
		
		this.editors.each( function(ed) {
			ed.hide();
		});
		if (this.result) this.result.hide();
		
		var window_size = window.getSize();
		// width of textareas and iframe
		var offset = 10; // options?
		var width = Math.floor($('content').getInnerWidth() / 2) - offset;
		
		$$('fieldset p').setStyle('width', width + offset);

		// set all editors width
		this.editors.each( function(ed) {
			ed.show();
			ed.setStyle('width', width);
		});
		
		// get JS height
		if (this.editors['js']) {
			var js = this.editors['js'];
			var js_top = js.getPosition().y;
			var height = window_size.y - js_top - offset;
			js.setStyle('height', height);
		}

		if (this.result) {
			this.result.show();
			if (!this.editors['js']) {
				var top = this.result.getPosition().y;
				var height = window_size.y - top - offset;
			}
			this.result.setStyles({
				'height': height,
				'width': width 
			});
		}
		
		this.fireEvent('resize');
	}
}
// add events to Layout object
$extend(Layout, new Events())

