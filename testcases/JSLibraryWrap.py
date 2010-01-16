from mooshell.models import JSLibraryWrap
from mooshell.testcases.base import *


class JSLibraryWrapTest(MooshellBaseTestCase):
	
	def test_create_and_get(self):
		js_wrap = JSLibraryWrap(
			name=TEST_LIB_WRAP_NAME,
			code_start='a',
			code_end='z'
			)
		js_wrap.save()
		js_wrap_get = JSLibraryWrap.objects.get(name=TEST_LIB_WRAP_NAME)
		self.failUnless(js_wrap_get)
		self.assertEqual(js_wrap.code_start, js_wrap_get.code_start)


	def test_unicode(self):
		js_wrap = JSLibraryWrap(name=TEST_LIB_WRAP_NAME)
		self.assertEqual(str(js_wrap), TEST_LIB_WRAP_NAME)
