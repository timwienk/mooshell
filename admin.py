from django.contrib import admin

from models import JSLibraryGroup, JSLibraryWrap, JSLibrary, JSDependency, Pastie, Shell, ExternalResource

class JSLibraryGroupAdmin(admin.ModelAdmin):	
	pass
admin.site.register(JSLibraryGroup, JSLibraryGroupAdmin)


class JSLibraryWrapAdmin(admin.ModelAdmin):	
	pass
admin.site.register(JSLibraryWrap, JSLibraryWrapAdmin)


class JSLibraryAdmin(admin.ModelAdmin):	
	pass
admin.site.register(JSLibrary, JSLibraryAdmin)


class JSDependencyAdmin(admin.ModelAdmin):	
	pass
admin.site.register(JSDependency, JSDependencyAdmin)


class PastieAdmin(admin.ModelAdmin):	
	pass
admin.site.register(Pastie, PastieAdmin)


class ShellAdmin(admin.ModelAdmin):
	search_fields = ['pastie__slug', 'author__username', 'description', 'code_css', 'code_html', 'code_js'] 
admin.site.register(Shell, ShellAdmin)


class ExternalResourceAdmin(admin.ModelAdmin):	
	pass
admin.site.register(ExternalResource, ExternalResourceAdmin)

