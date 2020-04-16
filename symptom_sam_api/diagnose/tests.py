from django.test import TestCase
from django.test.client import RequestFactory

# Create your tests here.
class ConditionTestCase(TestCase):
  def test_condition_by_id():
    factory = RequestFactory()