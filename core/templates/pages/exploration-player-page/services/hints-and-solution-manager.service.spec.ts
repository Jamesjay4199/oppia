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
 * @fileoverview Unit tests for the Hints/Solution Manager service.
 */

import { EventEmitter } from '@angular/core';

// TODO(#7222): Remove the following block of unnnecessary imports once
// hints-and-solution-manager.service.spec.ts is upgraded to Angular 8.
// import { FractionObjectFactory } from 'domain/objects/FractionObjectFactory';
import { HintObjectFactory } from 'domain/exploration/HintObjectFactory';
// import { SubtitledHtmlObjectFactory } from
//   'domain/exploration/SubtitledHtmlObjectFactory';
// import { UnitsObjectFactory } from 'domain/objects/UnitsObjectFactory';
// import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.
import { HintsAndSolutionManagerService } from 'pages/exploration-player-page/services/hints-and-solution-manager.service.ts';
import { TestBed, flushMicrotasks, fakeAsync } from '@angular/core/testing';
import { SolutionObjectFactory } from 'domain/exploration/SolutionObjectFactory';
import { PlayerPositionService } from './player-position.service';

fdescribe('HintsAndSolutionManager service', () => {
  // var $timeout;
  var hasms;
  var hof;
  var sof;
  var firstHint, secondHint, thirdHint;
  var solution;
  var pps;

  var mockNewCardAvailableEmitter = new EventEmitter();

  beforeEach(() => {
    // $timeout = $injector.get('$timeout');
    pps = TestBed.get(PlayerPositionService);
    spyOnProperty(pps, 'onNewCardAvailable').and.returnValue(
      mockNewCardAvailableEmitter);
    hasms = TestBed.get(HintsAndSolutionManagerService);
    hof = TestBed.get(HintObjectFactory);
    sof = TestBed.get(SolutionObjectFactory);

    firstHint = hof.createFromBackendDict({
      hint_content: {
        html: 'one',
        audio_translations: {}
      }
    });
    secondHint = hof.createFromBackendDict({
      hint_content: {
        html: 'two',
        audio_translations: {}
      }
    });
    thirdHint = hof.createFromBackendDict({
      hint_content: {
        html: 'three',
        audio_translations: {}
      }
    });
    solution = sof.createFromBackendDict({
      answer_is_exclusive: false,
      correct_answer: 'This is a correct answer!',
      explanation: {
        html: 'This is the explanation to the answer',
        audio_translations: {}
      }
    });

    // Initialize the service with two hints and a solution.
    hasms.reset([firstHint, secondHint], solution);
  });

  fit('should display hints at the right times', fakeAsync(() => {
    expect(hasms.isHintTooltipOpen()).toBe(false);
    expect(hasms.isHintViewable(0)).toBe(false);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.isHintConsumed(0)).toBe(false);
    expect(hasms.isHintConsumed(1)).toBe(false);

    expect(hasms.isHintTooltipOpen()).toBe(true);
    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.isHintConsumed(0)).toBe(true);
    expect(hasms.isHintConsumed(1)).toBe(false);


    // Function displayHint hides tooltip.
    expect(hasms.isHintTooltipOpen()).toBe(false);
    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(true);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.displayHint(1).getHtml()).toBe('two');
    expect(hasms.displayHint(3)).toBeNull();
    expect(hasms.isHintConsumed(0)).toBe(true);
    expect(hasms.isHintConsumed(1)).toBe(true);

    expect(hasms.isSolutionViewable()).toBe(true);

    flushMicrotasks();
  }));

  it('should not continue to display hints after after a correct answer is' +
     'submitted', fakeAsync(() => {
    expect(hasms.isHintViewable(0)).toBe(false);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.isHintConsumed(0)).toBe(false);
    expect(hasms.isHintConsumed(1)).toBe(false);

    flushMicrotasks();

    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.isHintConsumed(0)).toBe(true);
    expect(hasms.isHintConsumed(1)).toBe(false);

    mockNewCardAvailableEmitter.emit();
    flushMicrotasks();

    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.displayHint(1)).toBeNull();
    expect(hasms.isHintConsumed(0)).toBe(true);
    expect(hasms.isHintConsumed(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);

    flushMicrotasks();
  }));

  it('should show the correct number of hints', () => {
    expect(hasms.getNumHints()).toBe(2);
  });

  it('should correctly retrieve the solution', fakeAsync(() => {
    flushMicrotasks();

    expect(hasms.isSolutionConsumed()).toBe(false);
    expect(hasms.displaySolution().correctAnswer).toBe(
      'This is a correct answer!');
    expect(hasms.isSolutionConsumed()).toBe(true);

    // $timeout.verifyNoPendingTasks();
  }));

  it('should reset the service', fakeAsync(() => {
    hasms.reset([firstHint, secondHint, thirdHint], solution);
    expect(hasms.getNumHints()).toBe(3);

    expect(hasms.isHintViewable(0)).toBe(false);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isHintViewable(2)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);

    flushMicrotasks();

    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isHintViewable(2)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');

    flushMicrotasks();

    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(true);
    expect(hasms.isHintViewable(2)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.displayHint(1).getHtml()).toBe('two');

    flushMicrotasks();

    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(true);
    expect(hasms.isHintViewable(2)).toBe(true);
    expect(hasms.isSolutionViewable()).toBe(false);
    expect(hasms.displayHint(0).getHtml()).toBe('one');
    expect(hasms.displayHint(1).getHtml()).toBe('two');
    expect(hasms.displayHint(2).getHtml()).toBe('three');

    flushMicrotasks();

    expect(hasms.isSolutionViewable()).toBe(true);
  }));

  it('should reset the service when timeouts was called before',
    fakeAsync(() => {
      // Set timeout.
      flushMicrotasks();
      // Set tooltipTimeout.
      flushMicrotasks();

      // Reset service to 0 solutions so releaseHint timeout won't be called.
      hasms.reset([], solution);

      // There is no timeout to flush. timeout and tooltipTimeout variables
      // were cleaned.
      expect(() => {
        flushMicrotasks();
      }).toThrowError('No deferred tasks to be flushed');
      // $timeout.verifyNoPendingTasks();
    })
  );

  it('should not record the wrong answer when a hint is already released',
    fakeAsync(() => {
      expect(hasms.isHintTooltipOpen()).toBe(false);
      expect(hasms.isHintViewable(0)).toBe(false);
      expect(hasms.isHintViewable(1)).toBe(false);
      expect(hasms.isSolutionViewable()).toBe(false);

      flushMicrotasks();
      flushMicrotasks();

      expect(hasms.isHintTooltipOpen()).toBe(true);
      // It only changes hint visibility.
      expect(hasms.isHintViewable(0)).toBe(true);
      expect(hasms.isHintViewable(1)).toBe(false);
      expect(hasms.isHintViewable(2)).toBe(false);
      expect(hasms.isSolutionViewable()).toBe(false);

      hasms.recordWrongAnswer();
      // $timeout.verifyNoPendingTasks();

      expect(hasms.isHintTooltipOpen()).toBe(true);
      expect(hasms.isHintViewable(0)).toBe(true);
      expect(hasms.isHintViewable(1)).toBe(false);
      expect(hasms.isSolutionViewable()).toBe(false);
    }));

  it('should record the wrong answer twice', fakeAsync(() => {
    expect(hasms.isHintTooltipOpen()).toBe(false);
    expect(hasms.isHintViewable(0)).toBe(false);
    expect(hasms.isHintViewable(1)).toBe(false);
    expect(hasms.isSolutionViewable()).toBe(false);

    hasms.recordWrongAnswer();
    hasms.recordWrongAnswer();
    flushMicrotasks();
    flushMicrotasks();
    expect(hasms.isHintTooltipOpen()).toBe(true);

    hasms.displayHint(0);

    hasms.recordWrongAnswer();
    flushMicrotasks();


    flushMicrotasks();

    expect(hasms.isHintTooltipOpen()).toBe(false);
    expect(hasms.isHintViewable(0)).toBe(true);
    expect(hasms.isHintViewable(1)).toBe(true);
    expect(hasms.isSolutionViewable()).toBe(false);

    // $timeout.verifyNoPendingTasks();
  }));

  it('should send the solution viewed event emitter', () => {
    let mockSolutionViewedEventEmitter = new EventEmitter();
    expect(hasms.onSolutionViewedEventEmitter).toEqual(
      mockSolutionViewedEventEmitter);
  });

  it('should fetch EventEmitter for consumption of hint', () => {
    let mockHintConsumedEvent = new EventEmitter();
    expect(hasms.onHintConsumed).toEqual(mockHintConsumedEvent);
  });
});
