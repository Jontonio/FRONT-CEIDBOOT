import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MorThingsComponent } from './mor-things.component';

describe('MorThingsComponent', () => {
  let component: MorThingsComponent;
  let fixture: ComponentFixture<MorThingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MorThingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MorThingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
