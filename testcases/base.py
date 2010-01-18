from django.test import TestCase
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from mooshell.models import *

TEST_LIB_GROUP_NAME = 'TestLib'
TEST_LIB_WRAP_NAME = 'TestWrap'
TEST_LIB_WRAP_NAME_D = "%s_d" % TEST_LIB_WRAP_NAME
TEST_LIB_WRAP_NAME_L = "%s_l" % TEST_LIB_WRAP_NAME
TEST_LIB_VERSION = '1.0'
TEST_LIB_HREF = '/js/lib/js_lib.js'
TEST_DEPENDENCY_NAME = 'TestDependency'
TEST_DEPENDENCY_URL = '/js/lib/js_dependency.js'
TEST_EXTERNAL_URL_JS = 'http://example.com/some.js'
TEST_EXTERNAL_URL_CSS = 'http://example.com/some.css'
TEST_SLUG = "test_slug"
TEST_USERNAME = 'test_user'
TEST_EMAIL = 'test@example.com'
TEST_PASSWORD = 'V4lidP4ss'


class MooshellBaseTestCase(TestCase):
	" base test case - provides functions for other test cases "

	def get_lib_group(self, name=TEST_LIB_GROUP_NAME):
		return JSLibraryGroup(name=name)

	def get_lib_wrap(self, name=TEST_LIB_WRAP_NAME):
		return JSLibraryWrap(
			name=name,
			code_start='a',
			code_end='z'
			)

	def get_lib(self, version=TEST_LIB_VERSION, href=TEST_LIB_HREF, active=True):
		return JSLibrary(
			library_group=self.lib_group,
			version=version,
			href=href,
			wrap_l=self.wrap_l,
			wrap_d=self.wrap_d,
			active=active
			)

	def get_dependency(self, name=TEST_DEPENDENCY_NAME, ord=0, active=True):
		return JSDependency(
			library=self.lib,
			name=name,
			url=TEST_DEPENDENCY_URL,
			ord=ord,
			active=active
		)
	
	def get_pastie(self, slug=TEST_SLUG, author=None):
		return Pastie(
			slug=TEST_SLUG,
			author=author
		)
			
	def get_shell(self, pastie, js_lib, author=None, title=None):
		return Shell(
			pastie=pastie,
			js_lib=js_lib,
			author=author,
			title=title
		)

	def create_user(self, username=TEST_USERNAME, email=TEST_EMAIL, password=TEST_PASSWORD):
		return User.objects.create_user(username, email, password)
	

	def setUp(self):
		self.lib_group = self.get_lib_group()
		self.lib_group.save()
		self.wrap_l = self.get_lib_wrap(TEST_LIB_WRAP_NAME_L)
		self.wrap_l.save()
		self.wrap_d = self.get_lib_wrap(TEST_LIB_WRAP_NAME_D)
		self.wrap_d.save()
		self.lib = self.get_lib() 
		self.lib.save()
		self.dependency = self.get_dependency()
		self.dependency.save()
		self.external_js = ExternalResource(url=TEST_EXTERNAL_URL_JS)
		self.external_js.save()
		self.external_css = ExternalResource(url=TEST_EXTERNAL_URL_CSS)
		self.external_css.save()
		self.pastie = self.get_pastie()
		self.pastie.save()
		self.shell = self.get_shell(self.pastie, self.lib)
		self.shell.save()
		self.create_user()
		self.user = authenticate(username=TEST_USERNAME, password=TEST_PASSWORD)
		

	def tearDown(self):
		self.lib_group.delete()
		self.wrap_d.delete()
		self.wrap_l.delete()
		self.lib.delete()
		self.dependency.delete()
		self.external_js.delete()
		self.external_css.delete()
		self.user.delete()
	
		
