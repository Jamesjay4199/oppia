# Copyright 2013 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Tests for typed instance and parameter models."""

__author__ = 'Sean Lip'

import test_utils
import types

from data.objects.models import objects
from google.appengine.ext import ndb


class GetObjectClassUnitTests(test_utils.AppEngineTestBase):
    """Test the get_object_class() method."""

    def test_get_object_class_method(self):
        """Tests the normal behavior of get_object_class()."""
        IntClass = types.get_object_class('Int')
        assert IntClass.__name__ == 'Int'

    def test_fake_class_is_not_gettable(self):
        """Tests that trying to retrieve a fake class raises an error."""
        with self.assertRaises(TypeError):
            types.get_object_class('FakeClass')

    def test_base_object_is_not_gettable(self):
        """Tests that BaseObject exists and cannot be set as an obj_type."""
        assert getattr(objects, 'BaseObject')
        with self.assertRaises(TypeError):
            types.get_object_class('BaseObject')


class TypedInstanceUnitTests(test_utils.AppEngineTestBase):
    """Tests the TypedInstanceModel and TypedInstanceProperty classes."""

    def test_typed_instance_model(self):
        """Tests the TypedInstanceModel class."""
        model = types.TypedInstanceModel(obj_type='Int', value='Bad value')
        with self.assertRaises(TypeError):
            model.put()
        model.value = 1
        model.put()

    def test_typed_instance_property(self):
        class StructuredTestModel(ndb.Model):
            typed_instance = types.TypedInstanceProperty(required=True)

        model = types.TypedInstanceModel(obj_type='Int', value='Bad value')
        with self.assertRaises(TypeError):
            structured_model = StructuredTestModel(typed_instance=model)

        model.value = 1
        structured_model = StructuredTestModel(typed_instance=model)
        structured_model.put()
