from django import template

from mooshell.models import JSLibraryGroup, JSLibrary, JSDependency

register = template.Library()

@register.inclusion_tag('_js_libraries_options.html')
def get_js_libraries(group_name='Mootools'):
	" return a list of all possible libraries for a group "
	return { 
		'libraries': JSLibrary.objects.filter(library_group__name=group_name),
		'group_name': group_name
	}
	
	