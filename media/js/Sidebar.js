var Sidebar = new Class({
	Implements: [Options, Class.Occlude],
	parametrer: "Sidebar",
	options: {
		DOM: ''
	},
	initialize: function (options) {
		this.setOptions(options);
		if ($(this.options.DOM)) {
			this.element = $(this.options.DOM);
			if (this.occlude()) return this.occluded;
			
			this.resize(); 
			Layout.addEvents({
				'resize': this.resize.bind(this)
			});
			/*
			window.addEvents({
				'scroll': this.resize.bind(this)
			});
			*/
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