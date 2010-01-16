from django.db import IntegrityError

from mooshell.models import JSLibrary
from mooshell.testcases.base import *


class JSLibraryTest(MooshellBaseTestCase):

	def test_create_and_get(self):
		lib_get = JSLibrary.objects.get(version=TEST_LIB_VERSION)
		self.failUnless(lib_get)
		self.assertEqual(self.lib.version, lib_get.version)


	def test_unicode(self):
		uni = ' '.join((TEST_LIB_GROUP_NAME, TEST_LIB_VERSION))
		self.assertEqual(str(self.lib), uni)


	def test_get_active_only(self):
		lib = self.get_lib(version='inactive', href='inactive', active=False)
		lib.save()
		active = JSLibrary.objects.get_active(library_group__id=self.lib_group.id)
		self.failUnless(active)
		self.assertEqual(len(active), 1)

		JSLibrary.objects.get(href="inactive").delete()

	
	def test_ordering(self):
		lib = self.get_lib(version='b', href='b')
		lib.save()
		self.lib.version = 'a'
		self.lib.save()

		libs = JSLibrary.objects.get_active(library_group__id=self.lib_group.id)
		self.failUnless(libs)
		self.assertEqual(len(libs), 2)
		self.assertEqual(libs[0].version, 'a')
		
		JSLibrary.objects.get(href="b").delete()


	def test_href_unique(self):
		lib = self.get_lib(version='double')
		self.assertRaises(IntegrityError, lib.save)
		
