from django.db import models


class JSDependencyManager(models.Manager):
	def get_active(self, **kwargs):
		return self.get_query_set().filter(active=True,**kwargs)

class JSLibraryManager(models.Manager):
	def get_active(self, **kwargs):
		return self.get_query_set().filter(active=True,**kwargs)

class ShellManager(models.Manager):
	def all(self):
		public = self.get_query_set().filter(private=False)
		return public

	def all_available(self, user=None):
		public = self.get_query_set().filter(private=False)
		if user and user.is_authenticated():
			owned = self.get_query_set().filter(private=True, author__id=user.id)
			return public | owned
		return public

	def all_owned(self, user=None):
		return self.get_query_set().filter(private=True, author__id=user.id)

	def all_with_private(self):
		return super(ShellManager, self).all()
 
	def get_public_or_owned(self, **kwargs):
		try:
			return self.get_public(**kwargs)
		except:
			return self.get_owned(user, **kwargs)

	def get_public(self, **kwargs):
			return self.get_query_set().get(private=False, **kwargs)

	def get_owned(self, user, **kwargs):
			return self.get_query_set().get(private=True, author__id=user.id, **kwargs)

