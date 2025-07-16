import { Component, input } from '@angular/core';

@Component({
    selector: 'app-icon-circle-plus',
    imports: [],
    template: `
        <svg
            [class]="classes()"
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
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    `,
    styleUrl: './iconStyles.css',
})
export class CirclePlusIcon {
    classes = input<string>();
}
