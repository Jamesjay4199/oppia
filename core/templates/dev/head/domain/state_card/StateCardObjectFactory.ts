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
 * @fileoverview Factory for creating new frontend instances of State
 * card domain objects used in the exploration player.
 */

require(
  'pages/exploration-player-page/services/' +
  'audio-translation-language.service.ts');
require('services/ExplorationHtmlFormatterService.ts');

oppia.factory('StateCardObjectFactory', [
  'AudioTranslationLanguageService', 'ExplorationHtmlFormatterService',
  'INTERACTION_DISPLAY_MODE_INLINE', 'INTERACTION_SPECS',
  function(
      AudioTranslationLanguageService, ExplorationHtmlFormatterService,
      INTERACTION_DISPLAY_MODE_INLINE, INTERACTION_SPECS) {
    var StateCard = function(
        stateName, contentHtml, interactionHtml, interaction,
        inputResponsePairs, recordedVoiceovers, contentId) {
      this._stateName = stateName;
      this._contentHtml = contentHtml;
      this._interactionHtml = interactionHtml;
      this._inputResponsePairs = inputResponsePairs;
      this._interaction = interaction;
      this._recordedVoiceovers = recordedVoiceovers;
      this._contentId = contentId;
      this._completed = false;
    };

    StateCard.prototype.getStateName = function() {
      return this._stateName;
    };

    StateCard.prototype.getInteraction = function() {
      return this._interaction;
    };

    StateCard.prototype.getVoiceovers = function() {
      var recordedVoiceovers = this._recordedVoiceovers;
      var contentId = this._contentId;
      if (recordedVoiceovers) {
        return recordedVoiceovers.getBindableVoiceovers(contentId);
      }
      return [];
    };

    StateCard.prototype.getRecordedVoiceovers = function() {
      return this._recordedVoiceovers;
    };

    StateCard.prototype.isContentAudioTranslationAvailable = function() {
      return Object.keys(
        this.getVoiceovers()).length > 0 ||
        AudioTranslationLanguageService.isAutogeneratedAudioAllowed();
    },

    StateCard.prototype.getInteractionId = function() {
      if (this.getInteraction()) {
        return this.getInteraction().id;
      }
      return null;
    };

    StateCard.prototype.isTerminal = function() {
      var interactionId = this.getInteractionId();
      return (
        interactionId && INTERACTION_SPECS[interactionId].is_terminal);
    };

    StateCard.prototype.getHints = function() {
      return this.getInteraction().hints;
    };

    StateCard.prototype.getSolution = function() {
      return this.getInteraction().solution;
    };

    StateCard.prototype.doesInteractionSupportHints = function() {
      var interactionId = this.getInteractionId();
      return (
        !INTERACTION_SPECS[interactionId].is_terminal &&
        !INTERACTION_SPECS[interactionId].is_linear);
    };

    StateCard.prototype.isCompleted = function() {
      return this._completed;
    };

    StateCard.prototype.markAsCompleted = function() {
      this._completed = true;
    };

    StateCard.prototype.markAsNotCompleted = function() {
      this._completed = false;
    };

    StateCard.prototype.getInteractionInstructions = function() {
      var interactionId = this.getInteractionId();
      return (
        interactionId ? INTERACTION_SPECS[interactionId].instructions : '');
    };

    StateCard.prototype.getInteractionCustomizationArgs = function() {
      var interaction = this.getInteraction();
      if (!interaction) {
        return null;
      }
      return interaction.customizationArgs;
    };

    StateCard.prototype.isInteractionInline = function() {
      var interactionId = this.getInteractionId();
      return (
        !interactionId ||
        INTERACTION_SPECS[interactionId].display_mode ===
          INTERACTION_DISPLAY_MODE_INLINE);
    };

    StateCard.prototype.getContentHtml = function() {
      return this._contentHtml;
    };

    StateCard.prototype.getInteractionHtml = function() {
      return this._interactionHtml;
    };

    StateCard.prototype.getOppiaResponse = function(index) {
      return this._inputResponsePairs[index].oppiaResponse;
    };

    StateCard.prototype.getInputResponsePairs = function() {
      return this._inputResponsePairs;
    };

    StateCard.prototype.getLastInputResponsePair = function() {
      if (this._inputResponsePairs.length === 0) {
        return null;
      }
      return this._inputResponsePairs[this._inputResponsePairs.length - 1];
    };

    StateCard.prototype.getLastAnswer = function() {
      if (this.getLastInputResponsePair() === null) {
        return null;
      }
      return this.getLastInputResponsePair().learnerInput;
    };

    StateCard.prototype.getLastOppiaResponse = function() {
      if (this.getLastInputResponsePair() === null) {
        return null;
      }
      return this.getLastInputResponsePair().oppiaResponse;
    };

    StateCard.prototype.addInputResponsePair = function(inputResponsePair) {
      this._inputResponsePairs.push(angular.copy(inputResponsePair));
    };

    StateCard.prototype.setLastOppiaResponse = function(response) {
      // This check is added here to ensure that this._inputReponsePairs is
      // accessed only if there is atleast one input response pair present.
      // In the editor preview tab if a user clicks on restart from beginning
      // option just after submitting an answer for a card while the response
      // is still loading, this function is called after
      // this._inputResponsePairs is set to null as we are starting from the
      // first card again. Adding a check here makes sure that element at index
      // -1 is not accessed even in the above case.
      if (this._inputResponsePairs.length >= 1) {
        this._inputResponsePairs[
          this._inputResponsePairs.length - 1].oppiaResponse = response;
      }
    };

    StateCard.prototype.setInteractionHtml = function(interactionHtml) {
      this._interactionHtml = interactionHtml;
    };

    /**
     * @param {string} stateName - The state name for the current card.
     * @param {string} contentHtml - The HTML string for the content displayed
     *        on the content card.
     * @param {string} interactionHtml - The HTML that calls the interaction
     *        directive for the current card.
     * @param {Interaction} interaction - An interaction object that stores all
     *        the properties of the card's interaction.
     */
    // TODO (ankita240796) Remove the bracket notation once Angular2 gets in.
    /* eslint-disable dot-notation */
    StateCard['createNewCard'] = function(
    /* eslint-enable dot-notation */
        stateName, contentHtml, interactionHtml, interaction,
        recordedVoiceovers, contentId) {
      return new StateCard(
        stateName, contentHtml, interactionHtml, interaction, [],
        recordedVoiceovers, contentId);
    };

    return StateCard;
  }
]);
