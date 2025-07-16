import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Navbar],
    template: `
        <app-navbar [isPortraitView]="isPortraitView()" />
        <main class="center-content" [class]="{ 'bottom-margin': isPortraitView() }">
            <div class="gradient-background"></div>
            <div class="page-content">
                <router-outlet />
            </div>
        </main>
    `,
    styles: `
        main {
            padding-bottom: 0;
            min-height: 100dvh;
            position: relative;
            width: 100%;
            .page-content {
                width: 30rem;
            }
            .gradient-background {
                background-image: radial-gradient(
                    circle 600px at 50% 50%,
                    rgba(59, 130, 246, 0.3),
                    transparent
                );
                position: fixed;
                z-index: -10;
                width: 100%;
                height: 100dvh;
                pointer-events: none;
                top: 0;
            }
        }
        .center-content {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .sidebar-margin {
            margin-left: var(--sidebar-width);
        }
        .bottom-margin {
            -bottom: 7rem;
        }
    `,
})
export class App {
    private breakpointObserver = inject(BreakpointObserver);

    protected isPortraitView = signal<boolean>(false);

    constructor() {
        this.breakpointObserver
            .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
            .subscribe(result => {
                if (result.matches) {
                    this.isPortraitView.set(true);
                } else {
                    this.isPortraitView.set(false);
                }
            });
    }
}
