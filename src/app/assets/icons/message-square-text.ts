import { Component, input } from '@angular/core';

@Component({
    selector: 'app-icon-message-square-text',
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
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M13 8H7" />
            <path d="M17 12H7" />
        </svg>
    `,
    styleUrl: './iconStyles.css',
})
export class MessageSquareTextIcon {
    classes = input<string>();
}
