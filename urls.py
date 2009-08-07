from django.conf.urls.defaults import *

urlpatterns = patterns('mooShell.views',
    url(r'^mooshellmedia/(?P<path>.*)$', 'serve_static', name='mooshell_media'),
	url(r'^_save/$','pastie_save', name='pastie_save'),
	url(r'^_display/$','pastie_save', {'nosave': True}, name='pastie_display'),
	url(r'^ajax_json_response/$','ajax_json_response', name='ajax_json_response'),
	url(r'^ajax_html_javascript_response/$','ajax_html_javascript_response', name='ajax_html_javascript_response'),
	url(r'^ajax_json_echo/$','ajax_json_echo', name='ajax_json_echo'),
	url(r'^ajax_html_echo/$','ajax_html_echo', name='ajax_html_echo'),

	# compatibility with old moshell/* urls DO NOT USE THEM
	url(r'^mooshell/ajax_json_response/$','ajax_json_response', name='old_ajax_json_response'),
	url(r'^mooshell/ajax_html_javascript_response/$','ajax_html_javascript_response', name='old_ajax_html_javascript_response'),
    url(r'^mooshell/(?P<slug>.*)/$','pastie_edit', name='old_pastie'),

	# main action
    url(r'^(?P<slug>.*)/show/$','pastie_show', name='pastie_show'),
    url(r'^(?P<slug>.*)/$','pastie_edit', name='pastie'),
    url(r'^(?P<slug>.*)/(?P<version>.*)$','pastie_edit', name='shell'),
    url(r'^$','pastie_edit', name='pastie'),
   )
