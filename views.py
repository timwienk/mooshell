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
from django.contrib.auth.models import User

from models import Pastie, Shell, JSLibraryGroup, JSLibrary, JSLibraryWrap, JSDependency
from forms import PastieForm, ShellForm

def author_pastie_edit(req, author, slug, version=0, revision=0):
	"""
	display pastie authored by author
	"""
	user = get_object_or_404(User,username=author)
	shell = get_object_or_404(Shell,
								pastie__slug=slug,
								version=version,
								author=user)
	return pastie_edit(req, slug, version, revision, shell)
	
def pastie_edit(req, slug=None, version=0, revision=0, shell=None):
	"""
	display the edit shell page ( main display)
	"""
	c = {}
	if slug:
		if not shell: shell = get_object_or_404(Shell,
												pastie__slug=slug,
												version=version,
												author=None)
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
			'shell': shell if shell else None,
			'css_files': [
					reverse('mooshell_media', args=["css/light.css"])
					],
			'js_libs': [
					reverse('mooshell_media', args=[moo]),
					reverse('mooshell_media', args=[settings.MOOTOOLS_MORE]),
					reverse('mooshell_media', args=['js/lib/posteditor-clientcide-trunk-2.1.0.js']),
					reverse('codemirror', args=['js/codemirror.js']),
					reverse('codemirror', args=['js/mirrorframe.js']),
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
	Fix dependency
	"""
	if req.method == 'POST':
		slug = req.POST.get('slug', None)
		if slug:
			" UPDATE - get the instance if slug provided "
			pastieinstance = get_object_or_404(Pastie,slug=slug)
			pastieform = PastieForm(req.POST, instance=pastieinstance)
		else:	
			" CREATE "
			pastieform = PastieForm(req.POST)
			
		shellform = ShellForm(req.POST)
			
		if shellform.is_valid():
			
			" Instantiate shell data from the form "
			shell = shellform.save(commit=False)
			
			# add js_dependency
			dependency_ids = [int(dep[1]) for dep in req.POST.items() if dep[0].startswith('js_dependency')]
			dependencies = []
			for dep_id in dependency_ids:
				dep = JSDependency.objects.get(id=dep_id)
				dependencies.append(dep)
			if nosave:
				" return the pastie page only " 
				return pastie_display(req, None, shell, dependencies)
			" add user to shell if anyone logged in "
			if req.user.is_authenticated():
				shell.author = req.user
			
			if pastieform.is_valid():
				" prepare pastie object from DB and POST "
				pastie = pastieform.save(commit=False)
				
				" create slug from random string if needed"
				if not pastie.slug:
					pastie.set_slug()

				pastie.save()

				" Connect shell with pastie "
				shell.pastie = pastie
				if slug:
					shell.set_next_version()
					
				shell.save()
				
				for dep in dependencies:
					shell.js_dependency.add(dep)
			
				" return json with pastie url "
				return HttpResponse(simplejson.dumps(
						{'pastie_url': ''.join(['http://',req.META['SERVER_NAME'], shell.get_absolute_url()])}
						),mimetype='application/javascript'
					)
			else: error = "Pastie form does not validate %s" % pastieform['slug'].errors
		else: 
			error = "Shell form does not validate"
			for s in shellform:
				if hasattr(s, 'errors') and s.errors:
					error = error + str(s.__dict__) 
	else: error = 'Please use POST request'
	
	return HttpResponse(simplejson.dumps({'error':error}),
					mimetype='application/javascript'
	)

def pastie_display(req, slug, shell=None, dependencies = []):
	" render the shell only "
	if not shell:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
		" prepare dependencies if needed "
		dependencies = shell.js_dependency.all()
		
	wrap = getattr(shell.js_lib, 'wrap_'+shell.js_wrap, None) if shell.js_wrap else None
	if not slug:
		" assign dependencies from request "
	
	return render_to_response('pastie_show.html', {
									'shell': shell,
									'dependencies': dependencies,
									'wrap': wrap,
									'js_libs': [
										reverse('mooshell_media', args=[settings.MOOTOOLS_DEV_CORE]),
										reverse('mooshell_media', args=[settings.MOOTOOLS_MORE])
									]
							})
		
def author_pastie_show(req, author, slug, version=0):
	"""
	display pastie authored by author
	"""
	user = get_object_or_404(User,username=author)
	shell = get_object_or_404(Shell,
								pastie__slug=slug,
								version=version,
								author=user)
	return pastie_display(req, slug, shell, shell.js_dependency.all())

def pastie_show(req, slug, version=0):
	" render the shell only "
	shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
	return pastie_display(req, slug, shell, shell.js_dependency.all())


def author_show_part(req, author, slug, part, version=0):
	user = get_object_or_404(User,username=author)
	shell = get_object_or_404(Shell,pastie__slug=slug,version=version,author=user)
	return render_to_response('show_part.html', 
								{'content': getattr(shell, 'code_'+part)})

def show_part(req, slug, part, version=0):
	shell = get_object_or_404(Shell,pastie__slug=slug,version=version,author=None)
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

def codemirror_serve_static(request, path):
	media = os.path.join(settings.FRAMEWORK_PATH, 'mooshell/codemirror')
	if os.path.exists(os.path.join(media,path)) and os.path.isfile(os.path.join(media,path)):
		return static.serve( request, path, media)
	raise Http404 

	
def serve_static(request, path):
	media = os.path.join(settings.FRAMEWORK_PATH, 'mooshell/media')
	if os.path.exists(os.path.join(media,path)) and os.path.isfile(os.path.join(media,path)):
		return static.serve( request, path, media)
	raise Http404 

def get_dependencies(request, lib_id): 
	dependencies = JSDependency.objects.filter(library__id=lib_id)
	c = [{'id': d.id, 'name': d.name, 'selected': d.selected} for d in dependencies ]
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')
