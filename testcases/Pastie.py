from django.db import IntegrityError
from django.conf import settings   

from mooshell.models import Pastie
from mooshell.testcases.base import *

TEST_SLUG1 = 'test_slug_1'

class PastieTest(MooshellBaseTestCase):
	
	def test_get(self):
		pastie = Pastie.objects.get(slug=TEST_SLUG)
		self.failUnless(pastie)

	def test_unicode(self):
		self.assertEqual(str(self.pastie), TEST_SLUG)

	def test_unique(self):
		pastie = Pastie(slug=TEST_SLUG)
		self.assertRaises(IntegrityError, pastie.save)

	def test_automatic_favourite(self):
		pastie = Pastie(slug=TEST_SLUG1)
		pastie.save()
		self.assertEqual(pastie.favourite, None)
		shell = self.get_shell(pastie, self.lib)
		shell.save()
		self.failUnless(pastie.favourite)

	def test_slug_generation(self):
		# slug is generated on save
		pastie = Pastie()
		pastie.save()
		self.assertEqual(len(pastie.slug), settings.MOOSHELL_SLUG_LENGTH)
		# slug may be forced
		pastie = Pastie(slug=TEST_SLUG1)
		pastie.save()
		self.assertEqual(pastie.slug, TEST_SLUG1)

	def test_get_by_author(self):
		self.pastie.author = self.user
		self.pastie.save()
		self.failUnless(Pastie.objects.filter(author__username=self.user.username))
		
	def test_favourite(self):
		shell = self.get_shell(self.pastie, self.lib)
		shell.save()
		self.assertEqual(self.pastie.favourite.id, self.shell.id)
		self.pastie.favourite = shell
		self.pastie.save()
		self.assertEqual(self.pastie.favourite.id, shell.id)
