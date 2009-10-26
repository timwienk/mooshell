import os.path
import random
import time

from django.shortcuts import render_to_response, get_object_or_404
from django.views import static
from django.conf import settings   
from django.http import Http404, HttpResponseRedirect, HttpResponse
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.template import Template,RequestContext

from models import Pastie, Shell, JSLibraryGroup, JSLibrary, JSDependency
from forms import PastieForm, ShellForm

def pastie_edit(req, slug=None, version=0):
	"""
	display the edit shell page ( main display)
	"""
	c = {}
	if slug:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
		example_url = ''.join(['http://',req.META['SERVER_NAME'], shell.get_absolute_url()])
		#shell.version = shell.get_next_version()
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
	
	if settings.DEBUG: moo = settings.MOOTOOLS_DEV_CORE
	else: moo = settings.MOOTOOLS_CORE
	
	nopairs = req.GET.get('nopairs',False)
	
	c.update({
			'pastieform':pastieform,
			'shellform':shellform,
			'css_files': [
					reverse('mooshell_media', args=["css/light.css"])
					],
			'js_libs': [
					reverse('mooshell_media', args=[moo]),
					reverse('mooshell_media', args=[settings.MOOTOOLS_MORE]),
					reverse('mooshell_media', args=['js/lib/posteditor-clientcide-trunk-2.1.0.js']),
					reverse('mooshell_media', args=['js/lib/codemirror-0.64/js/codemirror.js']),
					reverse('mooshell_media', args=['js/lib/codemirror-0.64/js/mirrorframe.js']),
					reverse("mooshell_media", args=["js/Sidebar.js"]),
					reverse('mooshell_media', args=['js/LayoutCM.js']),
					reverse("mooshell_media", args=["js/Actions.js"]),
					reverse("mooshell_media", args=["js/EditorCM.js"]),
					reverse("mooshell_media", args=["js/Settings.js"]),
					],
			'title': "Shell Editor",
			'example_url': example_url,
			'web_server': 'http://%s' % req.META['SERVER_NAME'],
			'nopairs': nopairs,
			'get_dependencies_url': reverse("_get_dependencies", args=["lib_id"]).replace('lib_id','{lib_id}')
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
				return pastie_display(req, None, shell)
			
			if pastieform.is_valid():
				pastie = pastieform.save(commit=False)
				" create slug from random string"
				# at the moment no versioning - just saving with version 0
				if not pastie.slug:
					allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
					check_slug = True
					while check_slug:
						from random import choice
						pastie.slug =  ''.join([choice(allowed_chars) for i in range(settings.MOOSHELL_SLUG_LENGTH)]) #here some random stuff
						try:
							check_slug = Pastie.objects.get(slug=pastie.slug)
						except: 
							check_slug = False
					#TODO: check if slug already exists - create another if so
					
				pastie.save()
				
				shell.pastie = pastie
				if slug:
					shell.set_next_version()
					
				shell.save()
				" return json with pastie url "
				return HttpResponse(simplejson.dumps(
						{'pastie_url': ''.join(['http://',req.META['SERVER_NAME'], shell.get_absolute_url()])}
						),mimetype='application/javascript'
					)
			else: error = "Pastie form does not validate %s" % pastieform['slug'].errors
		else: error = "Shell form does not validate"
	else: error = 'Please use POST request'
	
	return HttpResponse(simplejson.dumps({'error':error}),
					mimetype='application/javascript'
	)

def pastie_display(req, slug, shell=None):
	" render the shell only "
	if not shell:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
	return render_to_response('pastie_show.html', {
									'shell': shell,
									'js_libs': [
										reverse('mooshell_media', args=[settings.MOOTOOLS_DEV_CORE]),
										reverse('mooshell_media', args=[settings.MOOTOOLS_MORE])
									]
							})
		
def pastie_show(req, slug, version=0):
	" render the shell only "
	shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
	return render_to_response('pastie_show.html', {
									'shell': shell,
									'js_libs': [
										reverse('mooshell_media', args=[settings.MOOTOOLS_DEV_CORE]),
										reverse('mooshell_media', args=[settings.MOOTOOLS_MORE])
									]
							})

def show_part(req, slug, part, version=0):
	shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
	return render_to_response('show_part.html', 
								{'content': getattr(shell, 'code_'+part)})

def ajax_json_echo(req):
	" echo GET and POST "
	time.sleep(random.uniform(1,3))
	c = {'get_response':{},'post_response':{}}
	for key, value in req.GET.items():
		c['get_response'].update({key: value})
	for key, value in req.POST.items():
		c['post_response'].update({key: value})
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')


def ajax_html_echo(req):
	time.sleep(random.uniform(1,3))
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

def get_dependencies(request, lib_id): 
	dependencies = JSDependency.objects.filter(library__id=lib_id)
	c = [{'id': d.id, 'name': d.name, 'selected': d.selected} for d in dependencies ]
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')