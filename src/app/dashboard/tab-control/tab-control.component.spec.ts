import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabControlComponent } from './tab-control.component';

describe('TabControlComponent', () => {
  let component: TabControlComponent;
  let fixture: ComponentFixture<TabControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
