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
	render: function () {

		// instantiate sidebar
		this.sidebar = new Sidebar({
			DOM: 'sidebar'
		});
		window.addEvent('resize', this.resize.bind(this));
		this.sidebar.addEvents({
			'accordion_resized': this.resize.bind(this)
		});

		// set editor labels
		var result = document.id('result');
		$$('.window_label').setStyle('opacity',0.8);
		if (result) {
			result.getElement('.window_label').setStyle('opacity', 0.3);
			this.result = result.getElement('iframe');
		}

		// set appropriate classes to the first and the last action items
		var actions = document.id('actions');
		actions.getElement('a.collapsedActions').addClass('firstChild');
		actions.getElements('a.collapsedActions:last-child').addClass('lastChild');

		this.resize();

		this.fireEvent('ready');
	},
	findLayoutElements: function() {
		// look up some elements, and cache the findings
		this.content = document.id('content');
		this.columns = this.content.getChildren('.column');
		this.windows = this.content.getElements('.window');
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
			ed.clean();
		});
	},
	resize: function(e) {

//		this.editors.each( function(ed) {
//			ed.hide();
//		});
//		if (this.result) {
//			this.result.hide();
//		}

		if (!this.content) {
			this.findLayoutElements();
		}

		var win_size = window.getSize();
		var av_height = win_size.y -
						this.columns[0].getPosition().y +
						this.windows[0].getStyle('top').toInt() +
						this.windows[1].getStyle('bottom').toInt();

		this.content.setStyle('height', av_height);

//		this.editors.each( function(ed) {
//			ed.show();
//		});
//		if (this.result) {
//			this.result.show();
//		}

		/*
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
		*/
		this.fireEvent('resize');
	}
};
// add events to Layout object
$extend(Layout, new Events());
