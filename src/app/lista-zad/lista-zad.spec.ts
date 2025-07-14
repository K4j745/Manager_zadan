import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaZad } from './lista-zad';

describe('ListaZad', () => {
  let component: ListaZad;
  let fixture: ComponentFixture<ListaZad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaZad]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaZad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
