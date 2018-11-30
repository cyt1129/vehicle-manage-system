import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdPanelComponent } from './obd-panel.component';

describe('ObdPanelComponent', () => {
  let component: ObdPanelComponent;
  let fixture: ComponentFixture<ObdPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
