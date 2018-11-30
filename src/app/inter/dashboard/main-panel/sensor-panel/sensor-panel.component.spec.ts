import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorPanelComponent } from './sensor-panel.component';

describe('SensorPanelComponent', () => {
  let component: SensorPanelComponent;
  let fixture: ComponentFixture<SensorPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
