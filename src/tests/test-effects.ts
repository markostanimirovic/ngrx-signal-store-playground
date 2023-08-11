import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

/**
 * Testing function which executes inside of an injectionContext and provides Change Detection trigger.
 *
 * It looks like, we need to have at least one component to execute effects.
 * AppRef::tick() does not work. Only ComponentFixture::detectChanges() seems to do the job.
 * withEffects renders a TestComponent and executes the tests inside an injectionContext.
 * This allows us to generate effects very easily.
 */
export const testEffects =
  (testFn: (runEffects: () => void) => void): (() => void) =>
  () => {
    const fixture = TestBed.configureTestingModule({
      imports: [TestComponent],
    }).createComponent(TestComponent);

    TestBed.runInInjectionContext(() => testFn(() => fixture.detectChanges()));
  };

@Component({
  template: '',
  standalone: true,
})
class TestComponent {}
