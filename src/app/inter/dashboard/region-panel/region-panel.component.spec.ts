import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionPannelComponent } from './region-panel.component';

describe('RegionPannelComponent', () => {
  let component: RegionPannelComponent;
  let fixture: ComponentFixture<RegionPannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionPannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionPannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
