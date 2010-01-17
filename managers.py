from django.db import models


class JSDependencyManager(models.Manager):
	def get_active(self, **kwargs):
		return self.get_query_set().filter(active=True,**kwargs)

class JSLibraryManager(models.Manager):
	def get_active(self, **kwargs):
		return self.get_query_set().filter(active=True,**kwargs)

class ShellManager(models.Manager):
	def all(self):
		return self.get_query_set().filter(private=False)

	def all_with_private(self):
		return super(ShellManager, self).all()
 
