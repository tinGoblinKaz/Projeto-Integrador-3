import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personagens } from './personagens';

describe('Personagens', () => {
  let component: Personagens;
  let fixture: ComponentFixture<Personagens>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personagens]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Personagens);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
