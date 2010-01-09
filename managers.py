from django.db import models


class JSDependencyManager(models.Manager):
	def get_active(self):
		return self.get_query_set().filter(active=True)


 
