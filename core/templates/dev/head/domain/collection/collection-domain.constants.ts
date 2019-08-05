// Copyright 2016 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Constants for collection domain services.
 */

// These should match the constants defined in core.domain.collection_domain.
// TODO(bhenning): The values of these constants should be provided by the
// backend.
// NOTE TO DEVELOPERS: the properties 'prerequisite_skills' and
// 'acquired_skills' are deprecated. Do not use them.
angular.module('oppia').constant(
  'CMD_ADD_COLLECTION_NODE', 'add_collection_node');
angular.module('oppia').constant('CMD_SWAP_COLLECTION_NODES', 'swap_nodes');
angular.module('oppia').constant(
  'CMD_DELETE_COLLECTION_NODE', 'delete_collection_node');
angular.module('oppia').constant(
  'CMD_EDIT_COLLECTION_PROPERTY', 'edit_collection_property');
angular.module('oppia').constant(
  'CMD_EDIT_COLLECTION_NODE_PROPERTY', 'edit_collection_node_property');
angular.module('oppia').constant('COLLECTION_PROPERTY_TITLE', 'title');
angular.module('oppia').constant('COLLECTION_PROPERTY_CATEGORY', 'category');
angular.module('oppia').constant('COLLECTION_PROPERTY_OBJECTIVE', 'objective');
angular.module('oppia').constant(
  'COLLECTION_PROPERTY_LANGUAGE_CODE', 'language_code');
angular.module('oppia').constant('COLLECTION_PROPERTY_TAGS', 'tags');
angular.module('oppia').constant(
  'CMD_ADD_COLLECTION_SKILL', 'add_collection_skill');
angular.module('oppia').constant(
  'CMD_DELETE_COLLECTION_SKILL', 'delete_collection_skill');
angular.module('oppia').constant(
  'COLLECTION_NODE_PROPERTY_PREREQUISITE_SKILL_IDS', 'prerequisite_skill_ids');
angular.module('oppia').constant(
  'COLLECTION_NODE_PROPERTY_ACQUIRED_SKILL_IDS', 'acquired_skill_ids');
