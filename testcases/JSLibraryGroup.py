from django.db import IntegrityError

from mooshell.models import JSLibraryGroup
from mooshell.testcases.base import *


class JSLibraryGroupTest(MooshellBaseTestCase):
	
	def test_create_and_get(self):
		lib_get = JSLibraryGroup.objects.get(name=TEST_LIB_GROUP_NAME)
		self.failUnless(lib_get)
		self.assertEqual(self.lib_group.name, lib_get.name)


	def test_get_selected(self):
		selected_name = "%s_selected" % TEST_LIB_GROUP_NAME
		JSLibraryGroup.objects.create(name=selected_name, selected=True)
		selected = JSLibraryGroup.objects.filter(selected=True)[0]
		self.failUnless(selected)
		self.assertEqual(selected.name, selected_name)


	def test_unicode(self):
		js_lib = JSLibraryGroup(name=TEST_LIB_GROUP_NAME)
		self.assertEqual(str(js_lib), TEST_LIB_GROUP_NAME)


	def test_unique(self):
		lib = self.get_lib_group()
		self.assertRaises(IntegrityError, lib.save)
