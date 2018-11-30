import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdComponent } from './obd.component';

describe('ObdComponent', () => {
  let component: ObdComponent;
  let fixture: ComponentFixture<ObdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
