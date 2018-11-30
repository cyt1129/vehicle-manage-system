import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObdindbComponent } from './obdindb.component';

describe('ObdindbComponent', () => {
  let component: ObdindbComponent;
  let fixture: ComponentFixture<ObdindbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObdindbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObdindbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
