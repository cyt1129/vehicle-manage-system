import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTpyeComponent } from './vehicle-tpye.component';

describe('VehicleTpyeComponent', () => {
  let component: VehicleTpyeComponent;
  let fixture: ComponentFixture<VehicleTpyeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleTpyeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTpyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
