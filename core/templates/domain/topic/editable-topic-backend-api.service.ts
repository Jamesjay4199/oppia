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
 * @fileoverview Service to send changes to a topic to the backend.
 */


import { UrlInterpolationService } from 'domain/utilities/url-interpolation.service';
import { TopicDomainConstants } from 'domain/topic/topic-domain.constants';
import { AppConstants } from 'core/templates/app.constants';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BackendChangeObject } from 'domain/editor/undo_redo/change.model';
import { SubtitledHtmlBackendDict } from 'domain/exploration/SubtitledHtmlObjectFactory';
import { RecordedVoiceOverBackendDict } from 'domain/exploration/RecordedVoiceoversObjectFactory';
import { WrittenTranslationsBackendDict } from 'domain/exploration/WrittenTranslationsObjectFactory';

export interface TopicDataDict {
  'topic_dict': {},
  'grouped_skill_summary_dicts': {},
  'skill_id_to_description_dict': SkillIdToDescription,
  'skill_question_count_dict': {},
  'skill_id_to_rubrics_dict': SkillIdToRubrics
  'classroom_url_fragment': {}
}

export interface StoryDataDict{
  'canonical_story_summary_dicts':{}
}

export interface SubtopicPageDict{
  'subtopic_page': {
    'id': string,
    'topic_id': string,
    'page_contents': {
      'subtitled_html': SubtitledHtmlBackendDict,
      'recorded_voiceovers': RecordedVoiceOverBackendDict,
      'written_translations': WrittenTranslationsBackendDict
    },
    'page_contents_schema_version': number,
    'language_code': string,
    'version': number
  }
}

export interface SkillIdToDescription {
  string: string
}
export interface SkillIdToRubrics {
  string: string
}

export interface UpdateTopicDict{
  'topic_dict': TopicDataDict,
  'skill_id_to_description_dict': SkillIdToDescription,
  'skill_id_to_rubrics_dict': SkillIdToRubrics
}

@Injectable({
  providedIn: 'root',
})
export class EditableTopicBackendApiService {
  constructor(
    private urlInterpolationService: UrlInterpolationService,
    private http: HttpClient
  ) {}

  private _fetchTopic(
      topicId: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const topicDataUrl = this.urlInterpolationService.interpolateUrl(
      AppConstants.EDITABLE_TOPIC_DATA_URL_TEMPLATE,
      {
        topic_id: topicId,
      }
    );
    this.http
      .get<TopicDataDict>(topicDataUrl)
      .toPromise()
      .then(
        (response) => {
          if (successCallback) {
            successCallback({
              topicDict: response.topic_dict,
              groupedSkillSummaries: response.grouped_skill_summary_dicts,
              skillIdToDescriptionDict: response.skill_id_to_description_dict,
              skillQuestionCountDict: { ...response.skill_question_count_dict },
              skillIdToRubricsDict: response.skill_id_to_rubrics_dict,
              classroomUrlFragment: response.classroom_url_fragment,
            });
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _fetchStories(
      topicId: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const storiesDataUrl = this.urlInterpolationService.interpolateUrl(
      TopicDomainConstants.TOPIC_EDITOR_STORY_URL_TEMPLATE,
      {
        topic_id: topicId,
      }
    );

    this.http
      .get<StoryDataDict>(storiesDataUrl)
      .toPromise()
      .then(
        (response) => {
          const canonicalStorySummaries =
            response.canonical_story_summary_dicts;
          if (successCallback) {
            successCallback(canonicalStorySummaries);
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _fetchSubtopicPage(
      topicId: string,
      subtopicId: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const subtopicPageDataUrl = this.urlInterpolationService.interpolateUrl(
      AppConstants.SUBTOPIC_PAGE_EDITOR_DATA_URL_TEMPLATE,
      {
        topic_id: topicId,
        subtopic_id: subtopicId.toString(),
      }
    );

    this.http
      .get<SubtopicPageDict>(subtopicPageDataUrl)
      .toPromise()
      .then(
        (response) => {
          const topic = response.subtopic_page;
          if (successCallback) {
            successCallback(topic);
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _deleteTopic(
      topicId: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const topicDataUrl = this.urlInterpolationService.interpolateUrl(
      AppConstants.EDITABLE_TOPIC_DATA_URL_TEMPLATE,
      {
        topic_id: topicId,
      }
    );

    this.http['delete'](topicDataUrl)
      .toPromise()
      .then(
        (response: {status: number}) => {
          if (successCallback) {
            successCallback(response.status);
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _updateTopic(
      topicId: string,
      topicVersion: number,
      commitMessage: string,
      changeList: BackendChangeObject[],
      successCallback: Function,
      errorCallback: Function
  ) {
    const editableTopicDataUrl = this.urlInterpolationService.interpolateUrl(
      AppConstants.EDITABLE_TOPIC_DATA_URL_TEMPLATE,
      {
        topic_id: topicId,
      }
    );
    const putData = {
      version: topicVersion,
      commit_message: commitMessage,
      topic_and_subtopic_page_change_dicts: changeList,
    };

    this.http
      .put<UpdateTopicDict>(editableTopicDataUrl, putData)
      .toPromise()
      .then(
        (response) => {
          if (successCallback) {
            successCallback({
              topicDict: response.topic_dict,
              skillIdToDescriptionDict: response.skill_id_to_description_dict,
              skillIdToRubricsDict: response.skill_id_to_rubrics_dict,
            });
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _doesTopicWithUrlFragmentExist(
      topicUrlFragment: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const topicUrlFragmentUrl = this.urlInterpolationService.interpolateUrl(
      TopicDomainConstants.TOPIC_URL_FRAGMENT_HANDLER_URL_TEMPLATE,
      {
        topic_url_fragment: topicUrlFragment,
      }
    );
    this.http
      .get<{'topic_url_fragment_exists': boolean}>(topicUrlFragmentUrl)
      .toPromise()
      .then(
        (response) => {
          if (successCallback) {
            successCallback(response.topic_url_fragment_exists);
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  private _doesTopicWithNameExist(
      topicName: string,
      successCallback: Function,
      errorCallback: Function
  ) {
    const topicNameUrl = this.urlInterpolationService.interpolateUrl(
      TopicDomainConstants.TOPIC_NAME_HANDLER_URL_TEMPLATE,
      {
        topic_name: topicName,
      }
    );
    this.http
      .get< {'topic_name_exists': boolean}>(topicNameUrl)
      .toPromise()
      .then(
        (response) => {
          if (successCallback) {
            successCallback(response.topic_name_exists);
          }
        },
        (errorResponse) => {
          if (errorCallback) {
            errorCallback(errorResponse.error.error);
          }
        }
      );
  }

  fetchTopic(topicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._fetchTopic(topicId, resolve, reject);
    });
  }

  fetchStories(topicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._fetchStories(topicId, resolve, reject);
    });
  }

  fetchSubtopicPage(topicId: string, subtopicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._fetchSubtopicPage(topicId, subtopicId, resolve, reject);
    });
  }

  /**
   * Updates a topic in the backend with the provided topic ID.
   * The changes only apply to the topic of the given version and the
   * request to update the topic will fail if the provided topic
   * version is older than the current version stored in the backend. Both
   * the changes and the message to associate with those changes are used
   * to commit a change to the topic. The new topic is passed to
   * the success callback, if one is provided to the returned promise
   * object. Errors are passed to the error callback, if one is provided.
   */
  updateTopic(
      topicId: string,
      topicVersion: number,
      commitMessage: string,
      changeList: BackendChangeObject[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this._updateTopic(
        topicId,
        topicVersion,
        commitMessage,
        changeList,
        resolve,
        reject
      );
    });
  }

  deleteTopic(topicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._deleteTopic(topicId, resolve, reject);
    });
  }

  doesTopicWithNameExistAsync(topicName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._doesTopicWithNameExist(topicName, resolve, reject);
    });
  }

  doesTopicWithUrlFragmentExistAsync(topicUrlFragment: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._doesTopicWithUrlFragmentExist(topicUrlFragment, resolve, reject);
    });
  }
}
