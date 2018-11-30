import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgComponent } from './cfg.component';

describe('CfgComponent', () => {
  let component: CfgComponent;
  let fixture: ComponentFixture<CfgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CfgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
