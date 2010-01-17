from mooshell.models import JSDependency
from mooshell.testcases.base import *


class JSDependencyTest(MooshellBaseTestCase):
	
	def test_get(self):
		dep = JSDependency.objects.get(name=TEST_DEPENDENCY_NAME)
		self.failUnless(dep)
		self.assertEqual(self.dependency.url, dep.url)


	def test_unicode(self):
		self.assertEqual(str(self.dependency), TEST_DEPENDENCY_NAME)


	def test_ordering(self):
		test_dep_name = 'x'
		dep = self.get_dependency(name='test_dep_name', ord=0)
		dep.save()
		self.dependency.ord = 1
		self.dependency.save()
		deps = JSDependency.objects.all()
		self.failUnless(deps)
		self.assertEqual(len(deps), 2)
		self.assertEqual(deps[0].name, TEST_DEPENDENCY_NAME)
		dep.delete()

	def test_adding_to_shell(self):
		self.assertEqual(len(self.shell.js_dependency.all()), 0)
		self.shell.js_dependency.add(self.dependency)
		self.assertEqual(len(self.shell.js_dependency.all()), 1)
