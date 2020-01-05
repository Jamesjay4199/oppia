// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for PretestQuestionBackendApiService.
 */

require('domain/question/pretest-question-backend-api.service.ts');
// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.

import {TranslatorProviderForTests} from 'tests/test.extras';

describe('Pretest question backend API service', function() {
  var PretestQuestionBackendApiService = null;
  var sampleDataResults = null;
  var $rootScope = null;
  var $scope = null;
  var $httpBackend = null;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module(
    'oppia', TranslatorProviderForTests));
  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));

  beforeEach(angular.mock.inject(function($injector) {
    PretestQuestionBackendApiService = $injector.get(
      'PretestQuestionBackendApiService');
    $rootScope = $injector.get('$rootScope');
    $scope = $rootScope.$new();
    $httpBackend = $injector.get('$httpBackend');

    // Sample question object returnable from the backend
    sampleDataResults = {
      pretest_question_dicts: [{
        id: '0',
        question_state_data: {
          content: {
            html: 'Question 1'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {}
          },
          interaction: {
            answer_groups: [],
            confirmed_unclassified_answers: [],
            customization_args: {},
            default_outcome: {
              dest: null,
              feedback: {
                html: 'Correct Answer'
              },
              param_changes: [],
              labelled_as_correct: true
            },
            hints: [
              {
                hint_content: {
                  html: 'Hint 1'
                }
              }
            ],
            solution: {
              correct_answer: 'This is the correct answer',
              answer_is_exclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            id: 'TextInput'
          },
          param_changes: [],
          solicit_answer_details: false
        },
        language_code: 'en',
        version: 1
      }],
      next_start_cursor: null
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should successfully fetch pretest questions from the backend',
    function() {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      $httpBackend.expect(
        'GET', '/pretest_handler/expId?story_id=storyId&cursor=').respond(
        sampleDataResults);
      PretestQuestionBackendApiService.fetchPretestQuestions(
        'expId', 'storyId').then(successHandler, failHandler);
      $httpBackend.flush();

      expect(successHandler).toHaveBeenCalledWith(
        sampleDataResults.pretest_question_dicts);
      expect(failHandler).not.toHaveBeenCalled();
    }
  );

  it('should use the rejection handler if the backend request failed',
    function() {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      $httpBackend.expect(
        'GET', '/pretest_handler/expId?story_id=storyId&cursor=').respond(
        500, 'Error loading pretest questions.');
      PretestQuestionBackendApiService.fetchPretestQuestions(
        'expId', 'storyId').then(successHandler, failHandler);
      $httpBackend.flush();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith(
        'Error loading pretest questions.');
    }
  );
});
