import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postcard } from './postcard';

describe('Postcard', () => {
    let component: Postcard;
    let fixture: ComponentFixture<Postcard>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Postcard],
        }).compileComponents();

        fixture = TestBed.createComponent(Postcard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
