from datetime import date, timedelta, datetime

from django.db import models
from django.db.models.signals import pre_save, post_save

def next_week():
	return datetime.now() + timedelta(days=7)

class Pastie(models.Model):
	"""
	default metadata
	"""
	# slug - created automatically in the pastie_save view
	slug = models.CharField(max_length=255, unique=True, blank=True)
	# string representing the author who originated first version
	created_by = models.CharField(max_length=255, null=True, blank=True)
	# how long author she should be hold by the system ?
	valid_until = models.DateTimeField('Valid until', default=next_week)
	# filled automatically
	created_at = models.DateTimeField(default=datetime.now)
	# some metadata of the shell
	title = models.CharField(max_length=255, null=True, blank=True)
	description = models.TextField(null=True, blank=True)
	# adds number of displays
	displayed = models.PositiveIntegerField(default=1)
	# is the shell private (do not list in search)
	private = models.BooleanField(default=False, blank=True)
	
	@models.permalink
	def get_absolute_url(self):
		return ('pastie',[self.slug])



class JSLibraryGroup(models.Model):
	"""
	Main library to load - MooTools core, jQuery, Prototype, etc.
	"""
	name = models.CharField('Name', max_length=100, unique=True)
	description = models.TextField(blank=True, null=True)
	selected = models.BooleanField(blank=True, default=False)


	
class JSLibraryWrap(models.Model):
	"""
	how to wrap the code in specific library
	"""
	code_start = models.CharField(max_length=255)
	code_end = models.CharField(max_length=255)


class JSLibrary(models.Model):
	"""
	Version of the library - Mootools 1.2.4, etc.
	"""
	library_group = models.ForeignKey(JSLibraryGroup)
	version = models.CharField(max_length=30, null=True, blank=True)
	url = models.URLField('URL to the core library file')
	selected = models.BooleanField(blank=True, default=False)
	wrap_d = models.ForeignKey(JSLibraryWrap, related_name='lib_for_domready')
	wrap_l = models.ForeignKey(JSLibraryWrap, related_name='lib_for_load')
	


class JSDependency(models.Model):
	"""
	Additional library file - MooTools more, Scriptaculous, etc.
	"""
	library = models.ForeignKey(JSLibrary)
	name = models.TextField('Name')
	url = models.URLField('URL to the library file')
	description = models.TextField(blank=True, null=True)
	selected = models.BooleanField(blank=True, default=False)
	
	
WRAPCHOICE = (
    ('', 'none'),
    ('d', 'onDomready'),
    ('l', 'onLoad'),
)

class Shell(models.Model):
	"""
	Holds shell data
	"""
	pastie = models.ForeignKey(Pastie)
	# editors
	code_css = models.TextField('CSS', null=True, blank=True)
	code_html = models.TextField('HTML', null=True, blank=True)
	code_js = models.TextField('Javascript', null=True, blank=True)
	# current version (slug remains the same - version changes)
	version = models.IntegerField(default=0)
	# filled automatically
	created_at = models.DateTimeField(default=datetime.now)
	# is it proposed to be an example
	proposed_example = models.BooleanField(default=False, blank=True)
	# string representing the author who originated current version (no checks made)
	modified_by = models.CharField(max_length=255, null=True, blank=True)
	# loaded library
	js_lib_group = models.ForeignKey(JSLibraryGroup, blank=True, default=1)
	js_lib = models.ForeignKey(JSLibrary)
	js_dependency = models.ManyToManyField(JSDependency)
	js_wrap = models.CharField(max_length=1, choices=WRAPCHOICE)

	
	@models.permalink
	def get_absolute_url(self):
		if self.version == 0:
			return  ('pastie',[self.pastie.slug])
		return ('shell',[self.pastie.slug,self.version])
	
	def get_next_version(self):
		shell_with_highest_version = Shell.objects.filter(pastie=self.pastie).order_by('-version')[0]
		return shell_with_highest_version.version + 1
	
	def set_next_version(self):
		self.version = self.get_next_version()
	
def increase_version_on_save(instance, **kwargs):
	if kwargs.get('raw',False): return
	if kwargs.get('created'):
		# check if any shell exists for the pastie
		try:
			shells = Shell.objects.select(pastie_id=instance.pastie_id).orderBy('-version')
			version = list(shells)[0].version + 1
		except:
			version = 0
		print version
		instance.version = version
		instance.save()
pre_save.connect(increase_version_on_save, sender=Shell)

	
class Example(models.Model):
	"""
	List of examples 
	"""
	name = models.CharField(max_length=255)
	pastie = models.ForeignKey(Pastie, related_name='example', unique=True)
	
	