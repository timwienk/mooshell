from django.conf.urls.defaults import *

urlpatterns = patterns('mooshell.views',
    url(r'^mooshellmedia/(?P<path>.*)$', 'serve_static', name='mooshell_media'),
		url(r'^codemirror/(?P<path>.*)$', 'codemirror_serve_static', name='codemirror'),
	url(r'^_save/$','pastie_save', name='pastie_save'),
	url(r'^_display/$','pastie_save', {'nosave': True}, name='pastie_display'),
	url(r'^ajax_json_response/$','ajax_json_response', name='ajax_json_response'),
	url(r'^ajax_html_javascript_response/$','ajax_html_javascript_response', name='ajax_html_javascript_response'),
	url(r'^ajax_json_echo/$','ajax_json_echo', name='ajax_json_echo'),
	url(r'^ajax_html_echo/$','ajax_html_echo', name='ajax_html_echo'),
	url(r'^_get_dependencies/(?P<lib_id>.*)/$','get_dependencies', name='_get_dependencies'),
	

	# compatibility with old moshell/* urls DO NOT USE THEM
	url(r'^mooshell/ajax_json_response/$','ajax_json_response', name='old_ajax_json_response'),
	url(r'^mooshell/ajax_html_javascript_response/$','ajax_html_javascript_response', name='old_ajax_html_javascript_response'),
    url(r'^mooshell/(?P<slug>.*)/$','pastie_edit', name='old_pastie'),

	# embedded
	url(r'^(?P<slug>\w+)/embedded/$','embedded', name='embedded'),
	url(r'^(?P<author>\w+)/(?P<slug>\w+)/embedded/$','embedded', name='author_embedded'),
	url(r'^(?P<slug>\w+)/(?P<version>\d+)/embedded/$','embedded', name='embedded_with_version'),
	url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/embedded/$','embedded', name='author_embedded_with_version'),
	
	# simple API
    url(r'^(?P<slug>\w+)/show_html/$','show_part', {'part': 'html'}, name='show_html'),
    url(r'^(?P<slug>\w+)/show_css/$','show_part', {'part': 'css'}, name='show_css'),
    url(r'^(?P<slug>\w+)/show_js/$','show_part', {'part': 'js'}, name='show_js'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)/show_html/$','show_part', {'part': 'html'}, name='show_html_with_version'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)/show_css/$','show_part', {'part': 'css'}, name='show_css_with_version'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)/show_js/$','show_part', {'part': 'js'}, name='show_js_with_version'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/show_html/$','show_part', {'part': 'html'}, name='author_show_html'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/show_css/$','show_part', {'part': 'css'}, name='author_show_css'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/show_js/$','show_part', {'part': 'js'}, name='author_show_js'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/show_html/$','show_part', {'part': 'html'}, name='author_show_html_with_version'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/show_css/$','show_part', {'part': 'css'}, name='author_show_css_with_version'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/show_js/$','show_part', {'part': 'js'}, name='author_show_js_with_version'),
    # show
    url(r'^(?P<slug>\w+)/show/$','pastie_show', name='pastie_show'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/show/$','pastie_show', name='author_pastie_show'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)/show/$','pastie_show', name='pastie_show_with_version'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/show/$','pastie_show', name='author_pastie_show_with_version'),
    
	# main action
    url(r'^(?P<slug>\w+)/$','pastie_edit', name='pastie'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/$','pastie_edit', name='author_pastie'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)$','pastie_edit', name='shell'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)$','pastie_edit', name='author_shell'),
    url(r'^(?P<slug>\w+)/(?P<version>\d+)/(?P<revision>\d+)$','pastie_edit', name='revision'),
    url(r'^(?P<author>\w+)/(?P<slug>\w+)/(?P<version>\d+)/(?P<revision>\d+)$','pastie_edit', name='author_revision'),
    url(r'^$','pastie_edit', name='pastie'),
   )
