from django.contrib import admin

from models import JSLibraryGroup, JSLibraryWrap, JSLibrary, JSDependency, Pastie, Shell

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
	prepopulated_fields = { 'slug': ['title'] }
admin.site.register(Pastie, PastieAdmin)


class ShellAdmin(admin.ModelAdmin):
	pass	
admin.site.register(Shell, ShellAdmin)