import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerPanelComponent } from './controller-panel.component';

describe('ControllerPanelComponent', () => {
  let component: ControllerPanelComponent;
  let fixture: ComponentFixture<ControllerPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllerPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
