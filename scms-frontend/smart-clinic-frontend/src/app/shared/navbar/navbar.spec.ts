import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing'; // ← أضف السطر ده

import { NavbarComponent } from './navbar'; // ← غير Navbar لـ NavbarComponent

describe('Navbar', () => {
  let component: NavbarComponent; // ← غير
  let fixture: ComponentFixture<NavbarComponent>; // ← غير

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule], // ← أضف RouterTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent); // ← غير
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});