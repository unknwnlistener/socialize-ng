import { Component, input } from '@angular/core';

@Component({
    selector: 'app-icon-circle-x',
    imports: [],
    template: `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            [class]="classes()"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
        </svg>
    `,
    styleUrl: './iconStyles.css',
})
export class CircleXIcon {
    classes = input<string>();
}
