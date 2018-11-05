import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoStateComponent } from './two-state.component';

describe('TwoStateComponent', () => {
  let component: TwoStateComponent;
  let fixture: ComponentFixture<TwoStateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoStateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
