// Copyright 2019 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview A service that fetches and stores the permissions
 * of a user for a particular exploration.
 */
require('domain/utilities/UrlInterpolationService.ts');
require('services/ContextService.ts');
require('services/contextual/UrlService.ts');

require(
  'pages/exploration-editor-page/exploration-editor-page.constants.ajs.ts');

angular.module('oppia').factory('UserExplorationPermissionsService', [
  '$http', 'ContextService', 'UrlInterpolationService', 'UrlService',
  'EXPLORATION_RIGHTS_URL',
  function(
      $http, ContextService, UrlInterpolationService, UrlService,
      EXPLORATION_RIGHTS_URL) {
    var permissionsPromise = null;
    var pathname = UrlService.getPathname();

    return {
      getPermissionsAsync: function() {
        var explorationRightsUrl = UrlInterpolationService.interpolateUrl(
          EXPLORATION_RIGHTS_URL, {
            exploration_id: ContextService.getExplorationId()
          }
        );
        if (!permissionsPromise) {
          permissionsPromise = $http.get(explorationRightsUrl).then(
            function(response) {
              return response.data;
            }
          );
        }
        return permissionsPromise;
      }
    };
  }
]);
