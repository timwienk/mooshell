from django.db import IntegrityError
from django.conf import settings   

from mooshell.models import Shell
from mooshell.testcases.base import *

class ShellTest(MooshellBaseTestCase):
	
	def test_get(self):
		shell = Shell.objects.get(pastie__slug=TEST_SLUG, version=0)
		self.failUnless(shell)

	def test_unicode(self):
		self.assertEqual(str(self.shell), '%s' % TEST_SLUG)
		shell = self.get_shell(self.pastie, self.lib)
		shell.title = 'test'
		shell.save()
		self.assertEqual(str(shell), 'test - %s-1' % TEST_SLUG)
		shell.code_html = '0123456789012345678901'
		self.assertEqual(str(shell), 'test - %s-1: 01234567890123456789' % TEST_SLUG)
		
	def test_search_public_only(self):
		self.shell.private = True
		self.shell.author = self.user
		self.shell.save()
		self.assertEqual(len(Shell.objects.all()), 0)
		self.failUnless(Shell.objects.all_with_private())
		self.assertEqual(len(Shell.objects.all_available(self.user)), 1)
		
	def test_versioning(self):
		# same version AND shell is forbidden
		shell = self.get_shell(self.pastie, self.lib)
		shell.save()
		self.assertEqual(shell.version, 1)
		# updating shell should not change the version
		shell.save()
		self.assertEqual(shell.version, 1)
		shell1 = self.get_shell(self.pastie, self.lib)
		shell1.save()
		self.assertEqual(shell1.version, 2)
		
	def test_get_private(self):
		self.shell.private=True
		self.shell.author = self.user
		self.shell.save()
		self.failUnless(Shell.objects.get_owned(self.user, pastie__slug=TEST_SLUG, version=0))
		
