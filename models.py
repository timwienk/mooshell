from datetime import date, timedelta, datetime

from django.db import models
from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.conf import settings   

def next_week():
	return datetime.now() + timedelta(days=7)



class JSLibraryGroup(models.Model):
	"""
	Main library to load - MooTools core, jQuery, Prototype, etc.
	"""
	name = models.CharField('Name', max_length=100, unique=True)
	description = models.TextField(blank=True, null=True)
	selected = models.BooleanField(blank=True, default=False)

	def __unicode__(self):
		return self.name

	class Admin:
		pass


	
class JSLibraryWrap(models.Model):
	"""
	how to wrap the code in specific library
	"""
	name = models.CharField(max_length=255)
	code_start = models.TextField()
	code_end = models.TextField()

	def __unicode__(self):
		return self.name

	class Admin:
		pass
	
	class Meta:
		verbose_name_plural = "JS Library Code Wrappers"



class JSLibrary(models.Model):
	"""
	Version of the library - Mootools 1.2.4, etc.
	"""
	library_group = models.ForeignKey(JSLibraryGroup, related_name="libs")
	version = models.CharField(max_length=30, null=True, blank=True)
	href = models.CharField('URL to the core library file', max_length=255, unique=True)
	selected = models.BooleanField(blank=True, default=False)
	wrap_d = models.ForeignKey(JSLibraryWrap, related_name='lib_for_domready')
	wrap_l = models.ForeignKey(JSLibraryWrap, related_name='lib_for_load')

	def __unicode__(self):
		return ' '.join((self.library_group.name, self.version)) 

	class Admin:
		pass	
	
	class Meta:
		verbose_name_plural = "JS Library versions"
		ordering = ["version"]



class JSDependencyManager(models.Manager):
	def get_active(self):
		return self.get_query_set().filter(active=True)

class JSDependency(models.Model):
	"""
	Additional library file - MooTools more, Scriptaculous, etc.
	"""
	library = models.ForeignKey(JSLibrary)
	name = models.CharField(max_length=150)
	url = models.CharField('URL to the library file', max_length=255)
	description = models.TextField(blank=True, null=True)
	selected = models.BooleanField(blank=True, default=False)
	ord = models.IntegerField("Order",default=0, blank=True, null=True)
	active = models.BooleanField(default=True, blank=True)

	objects = JSDependencyManager()

	def __unicode__(self):
		return self.name

	class Admin:
		pass
	
	class Meta:
		verbose_name_plural = "JS Dependencies"
		ordering = ["-ord"]

	
WRAPCHOICE = (
    ('', 'none'),
    ('d', 'onDomready'),
    ('l', 'onLoad'),
)


class Pastie(models.Model):
	"""
	default metadata
	"""
	slug = models.CharField(max_length=255, unique=True, blank=True)
	created_at = models.DateTimeField(default=datetime.now)
	author = models.ForeignKey(User, null=True, blank=True)
	
	def set_slug(self):
		from random import choice
		allowed_chars='abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
		check_slug = True
		# repeat until the slug will be unique
		while check_slug:
			self.slug = ''.join([choice(allowed_chars) for i in range(settings.MOOSHELL_SLUG_LENGTH)]) #here some random stuff
			try:
				check_slug = Pastie.objects.get(slug=self.slug)
			except: 
				check_slug = False

	
	def __unicode__(self):
		return self.slug
	
	@models.permalink
	def get_absolute_url(self):
		return ('pastie',[self.slug])
	
	class Admin:
		pass
	
	class Meta:
		verbose_name_plural = "Pasties"


class Shell(models.Model):
	"""
	Holds shell data
	"""
	pastie = models.ForeignKey(Pastie)
	version = models.IntegerField(default=0, blank=True)
	revision = models.IntegerField(default=0, blank=True, null=True)

	# authoring
	author = models.ForeignKey(User, null=True, blank=True)
	private = models.BooleanField(default=False, blank=True)

	# meta
	title = models.CharField(max_length=255, null=True, blank=True)
	description = models.TextField(null=True, blank=True)
	
	# STATISTICS (a bit)
	displayed = models.PositiveIntegerField(default=1, null=True, blank=True)
	
	# is the shell private (do not list in search)
	# how long author she should be hold by the system ?
	valid_until = models.DateTimeField('Valid until', default=None, null=True, blank=True)
	
	# editors
	code_css = models.TextField('CSS', null=True, blank=True)
	code_html = models.TextField('HTML', null=True, blank=True)
	code_js = models.TextField('Javascript', null=True, blank=True)
	# filled automatically
	created_at = models.DateTimeField(default=datetime.now)
	# is it proposed to be an example
	proposed_example = models.BooleanField(default=False, blank=True)
	# loaded library
	js_lib = models.ForeignKey(JSLibrary)
	js_lib_option = models.CharField(max_length=255, null=True, blank=True)
	js_dependency = models.ManyToManyField(JSDependency, null=True, blank=True)
	js_wrap = models.CharField(max_length=1, choices=WRAPCHOICE, default='d', null=True, blank=True)
	body_tag = models.CharField(max_length=255, null=True, blank=True, default="<body>")

	def __str__(self):
		past = ''
		if self.code_js: 
			past +=  ': ' + self.code_js[:20]
		elif self.code_html:
			past += ': ' + self.code_html[:20]
		elif self.code_css:
			past += ': ' + self.code_css[:20]
			
		return self.pastie.slug + '-' + str(self.version) + past 
        
	@models.permalink
	def get_absolute_url(self):
		if self.author:
			args = [self.author.username] 
			rev = 'author_'
		else:
			args=[]
			rev = ''

		if not self.revision or self.revision == 0:
			if not self.version or self.version == 0:
				rev += 'pastie'
				args.append(self.pastie.slug)
			else:
				rev += 'shell'
				args.extend([self.pastie.slug,self.version])
		else:
			rev += 'revision'
			args.extend([self.pastie.slug,self.version,self.revision])
		return (rev, args)
	
	@models.permalink
	def get_embedded_url(self):
		if self.author:
			args = [self.author.username] 
			rev = 'author_'
		else:
			args=[]
			rev = ''
		rev += 'embedded'
		if not self.revision or self.revision == 0:
			if not self.version or self.version == 0:
				args.append(self.pastie.slug)
			else:
				rev += '_with_version'
				args.extend([self.pastie.slug,self.version])
		else:
			rev += '_revision'
			args.extend([self.pastie.slug,self.version,self.revision])
		return (rev, args)
	
	@models.permalink
	def get_show_url(self):
		if self.author:
			args = [self.author.username] 
			rev = 'author_'
		else:
			args=[]
			rev = ''
		rev += 'pastie_show'
		if not self.revision or self.revision == 0:
			if not self.version or self.version == 0:
				args.append(self.pastie.slug)
			else:
				rev += '_with_version'
				args.extend([self.pastie.slug,self.version])
		else:
			rev += '_revision'
			args.extend([self.pastie.slug,self.version,self.revision])
		return (rev, args)
	
	def get_next_version(self):
		shell_with_highest_version = Shell.objects.filter(pastie=self.pastie).order_by('-version')[0]
		return shell_with_highest_version.version + 1
	
	def set_next_version(self):
		self.version = self.get_next_version()
	
	class Meta:
		ordering = ["-version", "revision"]
	
	class Admin:
		pass

        
    
	
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
	shell = models.ForeignKey(Shell, related_name='example', unique=True)
	
	class Meta:
		ordering = ["name"]
	
	
