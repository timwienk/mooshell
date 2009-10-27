/*
 * Define actions on the run/save/clean buttons
 */
var MooShellActions = new Class({
	Implements: [Options, Events],
	options: {
		// onRun: $empty,
		// onClean: $empty,
		formId: 'show-result',
		saveAndReloadId: 'update',
		saveAsNewId: 'savenew',
		runId: 'run',
		cleanId: 'clean',
		entriesSelector: 'textarea',
		resultLabel: 'result_label',
		resultInput: 'select_link',
		exampleURL: '',
		exampleSaveURL: ''
	},
	/*
	 * Assign actions
	 */
	initialize: function(options) {
		this.setOptions(options);
		if ($(this.options.saveAndReloadId)) 
			$(this.options.saveAndReloadId).addEvent('click', this.saveAndReload.bind(this));
		if ($(this.options.saveAsNewId)) 
			$(this.options.saveAsNewId).addEvent('click', this.saveAsNew.bind(this));
		if ($(this.options.runId)) 
			$(this.options.runId).addEvent('click', this.run.bind(this));
		if ($(this.options.cleanId)) 
			$(this.options.cleanId).addEvent('click', this.cleanEntries.bind(this));
		// actions run if shell loaded
		
		this.form = document.id(this.options.formId);
		
		if (this.options.exampleURL) {
			this.run(),
			this.displayExampleURL()
		}
	},
	// save and create new pastie
	saveAsNew: function() {
		Layout.updateFromMirror();
		$('id_slug').value='';
		$('id_version').value='0';
		new Request.JSON({
			'url': this.options.exampleSaveUrl,
			'onSuccess': function(json) {
				// reload page after successful save
				window.location = json.pastie_url + (nopairs ? "?nopairs=save" : '');
			}
		}).send(this.form);
	},
	// update existing (create shell with new version)
	saveAndReload: function() {
		Layout.updateFromMirror();
		new Request.JSON({
			'url': this.options.exampleSaveUrl,
			'onSuccess': function(json) {
				// reload page after successful save
				window.location = json.pastie_url + (nopairs ? "?nopairs=save" : '');
			}
		}).send(this.form);
	},
	// run - submit the form (targets to the iframe)
	run: function() { 
		Layout.updateFromMirror();
		document.id(this.options.formId).submit();
		this.fireEvent('run');
	},
	// clean all entries, rename example to default value
	cleanEntries: function () {
		// here reload Mirrors
		$$(this.options.entriesSelector).each( function(t) {t.value='';});
		if (this.resultText) {
			document.id(this.options.resultLabel).set('text', this.resultText);
		}
		if ($(this.options.saveAndReloadId)) $(this.options.saveAndReloadId).destroy()
 		this.fireEvent('clean');
	},
	// rename iframe label to present the current URL
	displayExampleURL: function() {
		/*
		var label = document.id(this.options.resultLabel)
		if (label) {
			this.resultText = label.get('text');
			label.appendText(': ');
			new Element('a',{
				href: this.options.exampleURL,
				text: this.options.exampleURL
			}).inject(label)
		}*/
		var resultInput = document.id(this.options.resultInput);
		if (resultInput) {
			if (Browser.Engine.gecko) {
				resultInput.setStyle('padding-top', '4px');
			}
			// resultInput.select();
		}
			
	}
});