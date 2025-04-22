import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendUserComponent } from './suspend-user.component';

describe('SuspendUserComponent', () => {
  let component: SuspendUserComponent;
  let fixture: ComponentFixture<SuspendUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspendUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
