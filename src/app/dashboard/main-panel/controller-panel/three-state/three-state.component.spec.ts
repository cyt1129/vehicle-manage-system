import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeStateComponent } from './three-state.component';

describe('ThreeStateComponent', () => {
  let component: ThreeStateComponent;
  let fixture: ComponentFixture<ThreeStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreeStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
