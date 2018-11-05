import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryPanelComponent } from './history-panel.component';

describe('HistoryPanelComponent', () => {
  let component: HistoryPanelComponent;
  let fixture: ComponentFixture<HistoryPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
