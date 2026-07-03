import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ameacas } from './ameacas';

describe('Ameacas', () => {
  let component: Ameacas;
  let fixture: ComponentFixture<Ameacas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ameacas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ameacas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
