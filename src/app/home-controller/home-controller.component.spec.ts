import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeControllerComponent } from './home-controller.component';

describe('HomeControllerComponent', () => {
  let component: HomeControllerComponent;
  let fixture: ComponentFixture<HomeControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
