import { Component, input } from '@angular/core';

@Component({
    selector: 'app-feed-section',
    imports: [],
    template: `
        <section>
            <div class="title">
                <h2>{{ title() }}</h2>
            </div>
            <div class="feed">
                <ng-content />
            </div>
        </section>
    `,
    styles: `
        section {
            width: 100%;
            padding-bottom: 7rem;
            .title {
                width: 100%;
                /* TODO: Fix sticky top */
                /* position: sticky; */
                padding: var(--space-xs);
                top: 0;
                z-index: 10;
                & > * {
                    margin: 0 auto;
                }
            }
            .feed {
                display: flex;
                flex-direction: column;
                gap: var(--space-xs);
                margin-top: var(--space-s);
            }
        }
    `,
})
export class FeedSection {
    title = input.required<string>();
}
