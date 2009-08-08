import os.path
import time

from django.shortcuts import render_to_response, get_object_or_404
from django.views import static
from django.conf import settings   
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.template import Template,RequestContext

from models import Pastie, Shell
from forms import PastieForm, ShellForm
import params

def pastie_edit(req, slug=None, version=0):
	"""
	display the edit shell page ( main display)
	"""
	c = {}
	if slug:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
		example_url = ''.join([settings.WEB_SERVER, shell.get_absolute_url()])
		shell.version += 1
		shellform = ShellForm(instance=shell)
		pastieform = PastieForm(instance=shell.pastie)
		c.update({
				'pastie': shell.pastie, 
				'shell': shell
				})
	else:
		example_url = ''
		pastieform = PastieForm()
		shellform = ShellForm()
	
	if settings.DEBUG: moo = params.MOOTOOLS_DEV_CORE
	else: moo = params.MOOTOOLS_CORE
	
	nopairs = req.GET.get('nopairs',False)
	
	c.update({
			'pastieform':pastieform,
			'shellform':shellform,
			'js_libs': [
					moo,
					params.MOOTOOLS_MORE,
					reverse('media', args=['js/lib/posteditor-clientcide-trunk-2.1.0.js']),
					reverse('media', args=['js/layout.js']),
					reverse("mooshell_media", args=["js/mooShell/Actions.js"]),
					reverse("mooshell_media", args=["js/mooShell/Editor.js"]),
					],
			'title': "Shell Editor",
			'example_url': example_url,
			'web_server': settings.WEB_SERVER,
			'nopairs': nopairs
			})
	return render_to_response('pastie_edit.html',c,
							context_instance=RequestContext(req))
	

def pastie_save(req, nosave=False):
	"""
	retrieve shell from the form, save or display
	"""
	if req.method == 'POST':
		slug = req.POST.get('slug', None)
		if slug:
			pastieinstance = get_object_or_404(Pastie,slug=slug)
			pastieform = PastieForm(req.POST, instance=pastieinstance)
		else:	
			pastieform = PastieForm(req.POST)
			
		shellform = ShellForm(req.POST)
			
		if shellform.is_valid():
			shell = shellform.save(commit=False)
			
			if nosave:
				" return the pastie page only " 
				return pastie_show(req, None, shell)
			
			if pastieform.is_valid():
				pastie = pastieform.save(commit=False)
				" create slug from random string"
				# at the moment no versioning - just saving with version 0
				if not pastie.slug:
					allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
					from random import choice
					pastie.slug =  ''.join([choice(allowed_chars) for i in range(params.SLUG_LENGTH)]) #here some random stuff
				
				pastie.save()
				shell.pastie = pastie
				shell.save()
				" return json with pastie url "
				return HttpResponse(simplejson.dumps(
						{'pastie_url': ''.join([settings.WEB_SERVER, shell.get_absolute_url()])}
						),mimetype='application/javascript'
					)
			else: error = "Pastie form does not validate %s" % pastieform['slug'].errors
		else: error = "Shell form does not validate"
	else: error = 'Please use POST request'
	
	return HttpResponse(simplejson.dumps({'error':error}),
					mimetype='application/javascript'
	)

		
def pastie_show(req, slug, shell=None):
	" render the shell only "
	if not shell:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
	return render_to_response('pastie_show.html', {
									'shell': shell,
									'js_libs': [
										params.MOOTOOLS_DEV_CORE,
										params.MOOTOOLS_MORE
									]
							})


def ajax_json_echo(req):
	" echo GET and POST "
	time.sleep(2)
	c = {'get_response':{},'post_response':{}}
	for key, value in req.GET.items():
		c['get_response'].update({key: value})
	for key, value in req.POST.items():
		c['post_response'].update({key: value})
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')


def ajax_html_echo(req):
	time.sleep(2)
	t = req.POST.get('html','')
	return HttpResponse(t)


def ajax_json_response(req):
	response_string = req.POST.get('response_string','This is a sample string')	
	return HttpResponse(simplejson.dumps(
		{
			'string': response_string,
			'array': ['This','is',['an','array'],1,2,3],
			'object': {'key': 'value'}
		}),
		mimetype='application/javascript'
	)


def ajax_html_javascript_response(req):
	return HttpResponse("<p>A sample paragraph</p><script type='text/javascript'>alert('sample alert');</script>")

	
def serve_static(request, path):
	media = os.path.join(settings.FRAMEWORK_PATH, 'mooshell/media')
	if os.path.exists(os.path.join(media,path)) and os.path.isfile(os.path.join(media,path)):
		return static.serve( request, path, media)
	raise Http404 
