from django import template

from mooshell.models import JSLibraryGroup, JSLibrary, JSDependency

register = template.Library()

@register.inclusion_tag('_js_libraries_options.html')
def get_js_libraries(group_name='Mootools', shell=None):
	" return a list of all possible libraries for a group "
	current_lib = shell.js_lib if shell else None
	libraries = JSLibrary.objects.filter(library_group__name=group_name)
	for lib in libraries:
		if current_lib:
			if lib == current_lib:
				lib.current = True
		else:
			lib.current = lib.selected
			if lib.current:
				current_lib = lib
			
	return { 
		'libraries': libraries,
		'group_name': group_name,
		'current_lib': current_lib,
		'shell': shell
	}
	
@register.inclusion_tag('_js_dependencies_choice.html')
def get_js_dependencies(js_lib, shell=None):
	" return a list of all possible dependencies for a js_lib "
	dependencies = JSDependency.objects.filter(library__id=js_lib.id)
	selected = shell.js_dependency.all() if shell else [dep for dep in dependencies if dep.selected]
	for dep in dependencies:
		if dep in selected:
			dep.current = True
			
	return {
		'dependencies': dependencies,
		'js_lib': js_lib
	}
	