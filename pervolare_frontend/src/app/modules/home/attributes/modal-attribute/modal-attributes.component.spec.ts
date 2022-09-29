import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributesModalComponent } from './modal-attributes.component';

describe('AttributesComponent', () => {
  let component: AttributesModalComponent;
  let fixture: ComponentFixture<AttributesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
