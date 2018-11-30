import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsPanelComponent } from './gps-panel.component';

describe('GpsPanelComponent', () => {
  let component: GpsPanelComponent;
  let fixture: ComponentFixture<GpsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
