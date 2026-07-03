import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Regras } from './regras';

describe('Regras', () => {
  let component: Regras;
  let fixture: ComponentFixture<Regras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Regras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Regras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
