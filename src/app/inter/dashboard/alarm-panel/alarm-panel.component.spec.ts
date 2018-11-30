import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmPanelComponent } from './alarm-panel.component';

describe('AlarmPanelComponent', () => {
  let component: AlarmPanelComponent;
  let fixture: ComponentFixture<AlarmPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
