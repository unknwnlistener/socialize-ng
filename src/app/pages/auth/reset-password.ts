import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Supabase } from './supabase';

@Component({
    selector: 'app-reset-password',
    imports: [ReactiveFormsModule],
    template: `
        <section>
            <div>
                <h2>Forgot your password?</h2>
                <p>
                    Enter the email address you used and we'll send you instructions to reset your
                    password.
                </p>
                <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
                    <p class="error">{{ formError() }}</p>
                    <label for="email">Email</label>
                    <input
                        placeholder="Enter email"
                        id="email"
                        type="email"
                        formControlName="email"
                        required
                    />
                    @if (this.loading()) {
                        Loading...
                    }
                    <button type="submit" [disabled]="this.loading() || !resetForm.valid">
                        Submit
                    </button>
                </form>
            </div>
        </section>
    `,
    styleUrl: `./auth.css`,
})
export default class ResetPassword {
    private readonly supabase = inject(Supabase);

    loading = signal<boolean>(false);
    formError = signal<string | null>(null);

    resetForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    onSubmit = async () => {
        try {
            this.loading.set(true);
            const email = this.resetForm.value.email as string;
            const { error } = await this.supabase.resetPassword(email);
            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                this.formError.set(error.message);
            }
        } finally {
            this.resetForm.reset();
            this.loading.set(false);
        }
    };
}
