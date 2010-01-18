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
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie

from models import Pastie, Shell, JSLibraryGroup, JSLibrary, JSLibraryWrap, JSDependency, ExternalResource
from forms import PastieForm, ShellForm
from base.views import serve_static as base_serve_static
from base.utils import log_to_file, separate_log


# consider better caching for that function.
@vary_on_cookie
def pastie_edit(req, slug=None, version=None, revision=None, author=None, skin=None):
	"""
	display the edit shell page ( main display)
	"""
	shell = None
	c = {}
	
	try:
		server = settings.MOOSHELL_FORCE_SERVER
	except:
		server = 'http://%s' % req.META['SERVER_NAME']

	title = settings.MOOSHELL_NEW_TITLE
		
	if slug:
		if skin:
			" important as {user}/{slug} is indistingushable from {slug}/{skin} "
			try:
				user = User.objects.get(username=slug)
				author = slug
				slug = skin
				skin = None
			except:
				pass
		pastie = get_object_or_404(Pastie, slug=slug)
		if version == None:
			shell = pastie.favourite
		else:
			user = get_object_or_404(User,username=author) if author else None
			shell = get_object_or_404(Shell, pastie__slug=slug, version=version, author=user)
		
		example_url = ''.join([server, shell.get_absolute_url()])
		embedded_url = ''.join([server, shell.get_embedded_url()])
		shellform = ShellForm(instance=shell)
		c.update({
				'is_author': (pastie.author and req.user.is_authenticated and pastie.author_id == req.user.id),
				'embedded_url': embedded_url
				})
		title = shell.title if shell.title else settings.MOOSHELL_VIEW_TITLE
	else:
		example_url = ''
		#pastieform = PastieForm()
		shellform = ShellForm()
	
	if settings.DEBUG: moo = settings.MOOTOOLS_DEV_CORE
	else: moo = settings.MOOTOOLS_CORE
	
	if not skin: skin = req.GET.get('skin',settings.MOOSHELL_DEFAULT_SKIN)

	
	# TODO: join some js files for less requests
	js_libs = [
		reverse('mooshell_js', args=[moo]),
		reverse('mooshell_js', args=[settings.MOOTOOLS_MORE]),
		reverse('codemirror', args=['js/codemirror.js']),
		reverse('codemirror', args=['js/mirrorframe.js']),
		reverse("mooshell_js", args=["Sidebar.js"]),
		reverse('mooshell_js', args=['LayoutCM.js']),
		reverse("mooshell_js", args=["Actions.js"]),
		reverse("mooshell_js", args=["EditorCM.js"]),
		reverse("mooshell_js", args=["Settings.js"]),
	]
	c.update({
		'shellform':shellform,
		'shell': shell,
		'css_files': [reverse('mooshell_css', args=["%s.css" % skin])],
		'js_libs': js_libs,
		'title': title,
		'example_url': example_url,
		'web_server': server,
		'skin': skin,
		'get_dependencies_url': reverse("_get_dependencies", 
								args=["lib_id"]).replace('lib_id','{lib_id}'),
		'get_library_versions_url': reverse("_get_library_versions", 
								args=["group_id"]).replace('group_id','{group_id}'),
	})
	return render_to_response('pastie_edit.html',c,
							context_instance=RequestContext(req))
	

def pastie_save(req, nosave=False, skin=None):
	"""
	retrieve shell from the form, save or display
	Fix dependency
	"""
	if req.method == 'POST':
		slug = req.POST.get('slug', None)
		if slug:
			" UPDATE - get the instance if slug provided "
			pastie = get_object_or_404(Pastie,slug=slug)
			#pastieform = PastieForm(req.POST, instance=pastieinstance)
		else:	
			" CREATE "
			pastie = Pastie()
			if not nosave:
				if req.user.is_authenticated():
					pastie.author = req.user 
				pastie.save()

		shellform = ShellForm(req.POST)
			
		if shellform.is_valid():
			
			" Instantiate shell data from the form "
			shell = shellform.save(commit=False)

			" Connect shell with pastie "
			shell.pastie = pastie
			
			# get javascript dependencies 
			dependency_ids = [int(dep[1]) for dep in req.POST.items() if dep[0].startswith('js_dependency')]
			dependencies = []
			for dep_id in dependency_ids:
				dep = JSDependency.objects.get(id=dep_id)
				dependencies.append(dep)

			# append external resources
			external_resources = []
			ext_ids = req.POST.get('add_external_resources', '').split(',')
			for ext_id in ext_ids:
				try:
					external_resources.append(ExternalResource.objects.get(id=int(ext_id)))
				except:
					pass

			if nosave:
				" return the pastie page only " 
				# no need to connect with pastie
				return pastie_display(req, None, shell, 
										dependencies=dependencies, 
										resources=external_resources, 
										skin=skin)

			" add user to shell if anyone logged in "
			if req.user.is_authenticated():
				shell.author = req.user

			# version is set automatically
			#if slug:
			#	shell.set_next_version()
				
			shell.save()

			# add saved dependencies			
			for dep in dependencies:
				shell.js_dependency.add(dep)
		
			# add saved external resources
			for ext in external_resources:
				shell.external_resources.add(ext)

			" return json with pastie url "
			return HttpResponse(simplejson.dumps({
					#'pastie_url': ''.join(['http://',req.META['SERVER_NAME'], shell.get_absolute_url()]),
					'pastie_url_relative': shell.get_absolute_url()
					}),mimetype='application/javascript'
				)
		else: 
			error = "Shell form does not validate"
			for s in shellform:
				if hasattr(s, 'errors') and s.errors:
					error = error + str(s.__dict__) 
	else: 
		error = 'Please use POST request'
	
	# Report errors
	return HttpResponse(simplejson.dumps({'error':error}),
					mimetype='application/javascript'
	)

def pastie_display(req, slug, shell=None, dependencies=[], resources=[], skin=None):
	" render the shell only "
	if not shell:
		shell = get_object_or_404(Shell,pastie__slug=slug,version=version)
		" prepare dependencies if needed "
		dependencies = shell.js_dependency.all()
		resources = shell.external_resources.all()
		
	wrap = getattr(shell.js_lib, 'wrap_'+shell.js_wrap, None) if shell.js_wrap else None
	if not slug:
		" assign dependencies from request "
	
	if not skin: skin = req.GET.get('skin',settings.MOOSHELL_DEFAULT_SKIN)
	
	return render_to_response('pastie_show.html', {
									'shell': shell,
									'dependencies': dependencies,
									'resources': resources,
									'resources_length': len(resources),
									'wrap': wrap,
									'skin': skin,
									'skin_css': reverse("mooshell_css", args=['result-%s.css' % skin])
							})
	
# consider better caching for that function.
def embedded(req, slug, version=None, revision=0, author=None, tabs=None, skin=None):
	" display embeddable version of the shell "
	pastie = get_object_or_404(Pastie,slug=slug)
	if version == None:
		shell = pastie.favourite
	else:
		user = get_object_or_404(User,username=author) if author else None
		shell = get_object_or_404(Shell, pastie__slug=slug, version=version, author=user)
	
	if not skin: skin = req.GET.get('skin', settings.MOOSHELL_DEFAULT_SKIN)
	if not tabs: tabs = req.GET.get('tabs', 'js,resources,html,css,result')
	
	try:
		server = settings.MOOSHELL_FORCE_SERVER
	except:
		server = 'http://%s' % req.META['SERVER_NAME']

	height = req.GET.get('height', None)
	tabs_order = tabs #req.GET.get('tabs',"js,html,css,result")
	tabs_order = tabs_order.split(',')
	
	if not shell.external_resources.all() and "resources" in tabs_order:
		tabs_order.remove("resources")

	tabs = []
	for t in tabs_order:
		tab = {	'type': t,
						'title': settings.MOOSHELL_EMBEDDED_TITLES[t]
					}
		if not t in ["result", "resources"]:
			tab['code'] = getattr(shell,'code_'+t)
		tabs.append(tab)	
															
	context = { 
		'height': height,
		'server': server,
		'shell': shell,
		'skin': skin,
		'tabs': tabs,
		'code_tabs': ['js', 'css', 'html'],
		'css_files': [
				reverse('mooshell_css', args=["embedded-%s.css" % skin])
				],
		'js_libs': [
				reverse('mooshell_js', args=[settings.MOOTOOLS_CORE]),
				reverse('mooshell_js', args=[settings.MOOTOOLS_MORE]),
				]
	}
	return render_to_response(	'embedded.html', 
								context, 
								context_instance=RequestContext(req))
		
# consider better caching for that function.
def pastie_show(req, slug, version=None, author=None, skin=None):
	" render the shell only "
	pastie = get_object_or_404(Pastie,slug=slug)
	if pastie.favourite and version == None:
		shell = pastie.favourite
	else:
		if version == None: 
			version=0
		user = get_object_or_404(User,username=author) if author else None
		shell = get_object_or_404(Shell, pastie__slug=slug, version=version, author=user)
	if not skin: skin = req.GET.get('skin', settings.MOOSHELL_DEFAULT_SKIN)
	return pastie_display(req, slug, shell, 
						dependencies=shell.js_dependency.all(), 
						resources=shell.external_resources.all(), skin=skin)


#TODO: remove if not used
def author_show_part(req, author, slug, part, version=0):
	return render_to_response('show_part.html', 
								{'content': getattr(shell, 'code_'+part)})

# it is bad for automate picking the latest revision 
# consider better caching for that function.
def show_part(req, slug, part, version=None, author=None):
	pastie = get_object_or_404(Pastie,slug=slug)
	if pastie.favourite and version == None:
		shell = pastie.favourite
	else:
		if version == None: 
			version=0
		user = get_object_or_404(User,username=author) if author else None
		shell = get_object_or_404(Shell, pastie__slug=slug, version=version, author=user)
	return render_to_response('show_part.html', 
								{'content': getattr(shell, 'code_'+part)})

def ajax_json_echo(req, delay=True):
	" echo GET and POST "
	if delay:
		time.sleep(random.uniform(1,3))
	c = {'get_response':{},'post_response':{}}
	for key, value in req.GET.items():
		c['get_response'].update({key: value})
	for key, value in req.POST.items():
		c['post_response'].update({key: value})
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')


def ajax_html_echo(req, delay=True):
	if delay:
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
	return HttpResponse("""<p>A sample paragraph</p>
<script type='text/javascript'>alert('sample alert');</script>""")


def serve_static(request, path, media='media', type=None):
	return base_serve_static(request, path, media, type)

def get_library_versions(request, group_id): 
	libraries = JSLibrary.objects.filter(library_group__id=group_id)
	c = {'libraries': [
			{
				'id': l.id, 
				'version': l.version, 
				'selected': l.selected, 
				'group_name': l.library_group.name,
				'active': l.active
			} for l in libraries 
		]
	}
	selected = [l for l in libraries if l.selected]
	if selected:
		selected = selected[0]
		c['dependencies'] = get_dependencies_dict(selected.id)
	return HttpResponse(simplejson.dumps(c),mimetype='application/javascript')


def get_dependencies(request, lib_id): 
	return HttpResponse(simplejson.dumps(get_dependencies_dict(lib_id)),mimetype='application/javascript')

def get_dependencies_dict(lib_id):
	dependencies = JSDependency.objects.filter(active=True,library__id=lib_id)
	return [{'id': d.id, 'name': d.name, 'selected': d.selected} for d in dependencies ]

def make_favourite(req):
	shell_id = req.POST.get('shell_id')
	shell = Shell.objects.get(id=shell_id)
	if req.user.is_authenticated() and req.user.id == shell.pastie.author.id:
		shell.pastie.favourite = shell
		shell.pastie.save()
		# TODO: clear the cache of the shell
		return HttpResponse(simplejson.dumps({'message':'saved as favourite'}),
							mimetype="application/javascript")
	raise Http404 


def api_get_users_pasties(req, author, limit=50):
	separate_log()
	user = get_object_or_404(User, username=author)
	pasties = Pastie.objects\
					.filter(author__username=author)\
					.exclude(favourite__title__isnull=True)\
					.exclude(favourite__title="")\
					.order_by('-created_at')\
					[:limit]
	
	try:
		server = settings.MOOSHELL_FORCE_SERVER
	except:
		server = 'http://%s' % req.META['SERVER_NAME']

	return render_to_response('api/pasties.json', 
								{'pasties': pasties, 'server': server},
								mimetype="application/javascript"
							)

def add_external_resource(req):
	url = req.POST.get('url')
	try:
		# check if url already in models
		resource = ExternalResource.objects.get(url=url)
		log_to_file('resource %s chosen' % resource.filename)
	except:
		# else create resource
		resource = ExternalResource(url=url)
		resource.save()
		log_to_file('resource %s created' % resource.filename)
	return HttpResponse(simplejson.dumps({
			'id': resource.id,
			'url': resource.url,
			'filename': resource.filename,
			'extension': resource.extension
		}),	mimetype="application/javascript")
