import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRegisterComponent } from './device-register.component';

describe('DeviceRegisterComponent', () => {
  let component: DeviceRegisterComponent;
  let fixture: ComponentFixture<DeviceRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
