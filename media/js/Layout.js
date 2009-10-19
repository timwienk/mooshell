var Sidebar = new Class({
	Implements: [Options, Class.Occlude],
	options: {
		DOM: ''
	},
	initialize: function (options) {
		this.setOptions(options);
		if ($(this.options.DOM)) {
			this.element = $(this.options.DOM);
			this.resize(); 
			Layout.addEvents({
				'resize': this.resize.bind(this)
			});
			window.addEvents({
				'scroll': this.resize.bind(this)
			});
			this.element.getFirst('.toggler').addClass('active');
			this.accordion = new Fx.Accordion('#' + this.options.DOM + ' .toggler', '#' + this.options.DOM + ' .element');
			this.accordion.addEvent('active', function(toggler, element) {
				toggler.addClass('active').getSiblings('.toggler').removeClass('active');				
			});
		}
	},
	resize: function () {
		this.element.setStyle('min-height',window.getSize().y - this.element.getPosition().y - 8)
	}
});

var Layout = {
	start: function () {
		this.sidebar = new Sidebar({DOM: 'sidebar'});
		
		this.sidebar.accordion.addEvent('active', function(){
			var self = this
			// resize needed as accordion height may be changed and scrollbar may appear
			// add delay to make accordion set it's height
			return (function() {self.resize()}.delay(700));
		}.bind(this));
		window.addEvent('resize', this.resizeWithDelay.bind(this));
		
		// set editor labels
		var results = $$('#result');
		var result = ($type(results) == 'array') ? results[0] : false;
		$$('.editor_label').setStyle('opacity',0.8);
		if (result) {
			result.getElement('.editor_label').setStyle('opacity', 0.3);
			this.result = result.getElement('iframe');
		}
		
		// resize
		this.resizeWithDelay();
		
		this.fireEvent('ready');
	},
	resizeWithDelay: function() {
		this.resize();
		// sometimes size is counted with scrollbars (especially in webkit)
		(function() { return this.resize(); }.bind(this) ).delay(100);
		// after scrollbars are removed - resize again to the right size
		(function() { return this.resize(); }.bind(this) ).delay(300);
	},
	resize: function(e) {
		// hide results to measure the size of a window without them
		if (this.js_edit) this.js_edit.element.hide();
		if (this.result) this.result.hide();
		var window_size = window.getSize();
		// width of textareas and iframe
		var width = Math.floor($('content').getSize().x / 2) - 10; // 8px gap + 2px border
		
		$$('fieldset p').setStyle('width', width + 10);

		if (this.js_edit) {
			this.js_edit.element.show();
			var top = this.js_edit.element.getPosition().y;
			var height = window_size.y - top - 10; // 8px gap + 2px border
			this.js_edit.element.setStyles({
				'height': height,
				'width': width
			});
		}
		if (this.result) {
			this.result.show();
			if (!this.js_edit) {
				var top = this.result.getPosition().y;
				var height = window_size.y - top - 10;
			}
			this.result.setStyles({
				'height': height,
				'width': width
			});
		}
		if (this.css_edit) this.css_edit.element.setStyle('width', width);
		if (this.html_edit) this.html_edit.element.setStyle('width', width);
		
		this.fireEvent('resize');
	}
}
// add events to Layout object
$extend(Layout, new Events())

