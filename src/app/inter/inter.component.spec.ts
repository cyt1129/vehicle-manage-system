import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterComponent } from './inter.component';

describe('TestComponent', () => {
  let component: InterComponent;
  let fixture: ComponentFixture<InterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
