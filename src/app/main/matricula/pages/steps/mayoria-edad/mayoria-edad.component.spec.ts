import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MayoriaEdadComponent } from './mayoria-edad.component';

describe('MayoriaEdadComponent', () => {
  let component: MayoriaEdadComponent;
  let fixture: ComponentFixture<MayoriaEdadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MayoriaEdadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MayoriaEdadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
