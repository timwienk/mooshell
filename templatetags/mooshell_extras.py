from django import template

from mooshell.models import JSLibraryGroup, JSLibrary, JSDependency

register = template.Library()


@register.inclusion_tag('_js_library_groups.html')
def get_js_library_groups(shell=None):
	"return a list of possible library groups if more than one"
	current_group = shell.js_lib.library_group if shell else None
	current_lib = shell.js_lib if shell else None
	groups = JSLibraryGroup.objects.all()
	for group in groups:
		group.lib_list = list(group.libs.all())
		if current_group:
			if group == current_group:
				group.current = True
				for lib in group.lib_list:
					if lib == current_lib:
						lib.current = True
		else:
			group.current = group.selected
			if group.current:
				current_group = group
				for lib in group.lib_list:
					lib.current = lib.selected
					if lib.current:
						current_lib = lib
	return {
		'groups': groups,
		'current_group': current_group,
		'current_lib': current_lib,
		'shell': shell
		}

def prepare_js_libraries(group_name, shell=None):
	" return a list of all possible libraries for a group "
	current_lib = shell.js_lib if shell else None
	libraries = JSLibrary.objects.filter(library_group__name=group_name)
	lib = False
	for lib in libraries:
		if current_lib:
			if lib == current_lib:
				lib.current = True
		else:
			lib.current = lib.selected
			if lib.current:
				current_lib = lib

	# if something went wrong ...
	if lib and not current_lib :
		current_lib = lib
			
	return { 
		'libraries': libraries,
		'group_name': group_name,
		'current_lib': current_lib,
		'shell': shell
	}
	

@register.inclusion_tag('_js_libraries_options.html')
def get_js_libraries(group_name, shell=None):
	return prepare_js_libraries(group_name, shell)
	
@register.inclusion_tag('_js_dependencies_choice.html')
def get_js_dependencies(js_lib, shell=None):
	" return a list of all possible dependencies for a js_lib "
	dependencies = list(JSDependency.objects.filter(active=True,library__id=js_lib.id))
	if shell:
		inactive_included = list(shell.js_dependency.filter(active=False))
		if inactive_included:
			dependencies.extend(inactive_included)
		selected = shell.js_dependency.all()
	else:
		selected = [dep for dep in dependencies if dep.selected]
	
	for dep in dependencies:
		if dep in selected:
			dep.current = True
			
	return {
		'dependencies': dependencies,
		'js_lib': js_lib
	}
	
