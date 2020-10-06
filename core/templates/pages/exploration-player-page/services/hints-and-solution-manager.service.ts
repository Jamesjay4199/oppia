// Copyright 2017 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Utility service for Hints in the learner's view.
 */

import { EventEmitter, Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';
import { Hint } from 'domain/exploration/HintObjectFactory';
import { Solution } from 'domain/exploration/SolutionObjectFactory';
import { SubtitledHtml } from 'domain/exploration/SubtitledHtmlObjectFactory';

import { ExplorationPlayerConstants } from 'pages/exploration-player-page/exploration-player-page.constants.ts';
import { PlayerPositionService } from 'pages/exploration-player-page/services/player-position.service.ts';

@Injectable({
  providedIn: 'root',
})
export class HintsAndSolutionManagerService {
  private timeout = null;
  private ACCELERATED_HINT_WAIT_TIME_MSEC = 10000;
  private WAIT_FOR_TOOLTIP_TO_BE_SHOWN_MSEC = 60000;
  private _solutionViewedEventEmitter: EventEmitter<void> = new EventEmitter();

  private numHintsReleased = 0;
  private numHintsConsumed = 0;
  private solutionReleased = false;
  private solutionConsumed = false;
  private hintsForLatestCard: Hint[] = [];
  private solutionForLatestCard: Solution = null;
  private wrongAnswersSinceLastHintConsumed = 0;
  private correctAnswerSubmitted = false;

  private _hintConsumedEventEmitter: EventEmitter<void> = new EventEmitter();

  // Variable tooltipIsOpen is a flag which says that the tooltip is currently
  // visible to the learner.
  private tooltipIsOpen = false;
  // This is set to true as soon as a hint/solution is clicked or when the
  // tooltip has been triggered.
  private hintsDiscovered = false;
  private tooltipTimeout = null;

  constructor(private playerPositionService: PlayerPositionService) {
    playerPositionService.onNewCardAvailable.subscribe(() => {
      this.correctAnswerSubmitted = true;
      this.tooltipIsOpen = false;
    });
  }

  // This replaces any timeouts that are already queued.
  private enqueueTimeout(func: Function, timeToWaitMsec: number): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(func, timeToWaitMsec);
  }

  private showTooltip(): void {
    this.tooltipIsOpen = true;
    this.hintsDiscovered = true;
  }

  private releaseHint(): void {
    if (!this.correctAnswerSubmitted) {
      this.numHintsReleased++;
      if (!this.hintsDiscovered && !this.tooltipTimeout) {
        this.tooltipTimeout = setTimeout(
          this.showTooltip,
          this.WAIT_FOR_TOOLTIP_TO_BE_SHOWN_MSEC
        );
      }
    }
  }

  private releaseSolution(): void {
    this.solutionReleased = true;
  }

  private accelerateHintRelease(): void {
    this.enqueueTimeout(this.releaseHint, this.ACCELERATED_HINT_WAIT_TIME_MSEC);
  }

  private areAllHintsExhausted(): boolean {
    return this.numHintsReleased === this.hintsForLatestCard.length;
  }

  private isAHintWaitingToBeViewed(): boolean {
    return this.numHintsConsumed < this.numHintsReleased;
  }

  private consumeHint() {
    this.hintsDiscovered = true;
    this.tooltipIsOpen = false;
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    this._hintConsumedEventEmitter.emit();
    this.numHintsConsumed++;
    this.wrongAnswersSinceLastHintConsumed = 0;

    let funcToEnqueue = null;
    if (!this.areAllHintsExhausted()) {
      funcToEnqueue = this.releaseHint;
    } else if (!!this.solutionForLatestCard && !this.solutionReleased) {
      funcToEnqueue = this.releaseSolution;
    }
    if (funcToEnqueue) {
      this.enqueueTimeout(
        funcToEnqueue,
        ExplorationPlayerConstants.WAIT_FOR_SUBSEQUENT_HINTS_MSEC
      );
    }
  }

  reset(newHints: Hint[], newSolution: Solution): void {
    this.numHintsReleased = 0;
    this.numHintsConsumed = 0;
    this.solutionReleased = false;
    this.solutionConsumed = false;
    this.hintsForLatestCard = newHints;
    this.solutionForLatestCard = newSolution;
    this.wrongAnswersSinceLastHintConsumed = 0;
    this.correctAnswerSubmitted = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }

    if (this.hintsForLatestCard.length > 0) {
      this.enqueueTimeout(
        this.releaseHint,
        ExplorationPlayerConstants.WAIT_FOR_FIRST_HINT_MSEC
      );
    }
  }

  // WARNING: This method has a side-effect. If the retrieved hint is a
  // pending hint that's being viewed, it starts the timer for the next
  // hint.
  displayHint(index: number): SubtitledHtml {
    if (
      index === this.numHintsConsumed &&
      this.numHintsConsumed < this.numHintsReleased
    ) {
      // The latest hint has been consumed. Start the timer.
      this.consumeHint();
    }

    if (index < this.numHintsReleased) {
      return this.hintsForLatestCard[index].hintContent;
    }
    return null;
  }

  displaySolution(): Solution {
    this.hintsDiscovered = true;
    this.solutionConsumed = true;
    this._solutionViewedEventEmitter.emit();
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    return this.solutionForLatestCard;
  }

  getNumHints(): number {
    return this.hintsForLatestCard.length;
  }

  isHintViewable(index: number): boolean {
    return index < this.numHintsReleased;
  }

  isHintConsumed(index: number): boolean {
    return index < this.numHintsConsumed;
  }

  isHintTooltipOpen(): boolean {
    return this.tooltipIsOpen;
  }

  isSolutionViewable(): boolean {
    return this.solutionReleased;
  }

  isSolutionConsumed(): boolean {
    return this.solutionConsumed;
  }

  recordWrongAnswer(): void {
    if (this.isAHintWaitingToBeViewed()) {
      return;
    }

    this.wrongAnswersSinceLastHintConsumed++;
    if (!this.areAllHintsExhausted()) {
      if (
        this.numHintsReleased === 0 &&
        this.wrongAnswersSinceLastHintConsumed >= 2
      ) {
        this.accelerateHintRelease();
      } else if (
        this.numHintsReleased > 0 &&
        this.wrongAnswersSinceLastHintConsumed >= 1
      ) {
        this.accelerateHintRelease();
      }
    }
  }

  get onSolutionViewedEventEmitter(): EventEmitter<void> {
    return this._solutionViewedEventEmitter;
  }

  get onHintConsumed(): EventEmitter<void> {
    return this._hintConsumedEventEmitter;
  }
}

angular
  .module('oppia')
  .factory(
    'HintsAndSolutionManagerService',
    downgradeInjectable(HintsAndSolutionManagerService)
  );
