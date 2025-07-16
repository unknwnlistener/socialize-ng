import { Component, inject, signal } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Supabase } from './supabase';

@Component({
    selector: 'app-update-password',
    imports: [ReactiveFormsModule],
    template: `
        <section>
            <div>
                <h2>Reset Password</h2>
                <p>Please enter your new password</p>
                <form [formGroup]="updatePasswordForm" (ngSubmit)="onSubmit()">
                    <p class="error">{{ formError() }}</p>
                    <label for="email">New Password</label>
                    <input
                        placeholder="Enter new password"
                        id="password"
                        type="password"
                        formControlName="password"
                        required
                    />

                    <label for="rePassword">Re-type New Password</label>
                    <input
                        placeholder="Enter password"
                        id="rePassword"
                        type="password"
                        formControlName="rePassword"
                        required
                    />
                    @if (
                        this.updatePasswordForm.get('rePassword')?.touched &&
                        this.updatePasswordForm.hasError('unmatchedPasswords')
                    ) {
                        <span>Passwords do not match</span>
                    }

                    <button type="submit" [disabled]="this.loading() || !updatePasswordForm.valid">
                        Update Password
                    </button>
                </form>
            </div>
        </section>
    `,
    styleUrl: `auth.css`,
})
export default class UpdatePassword {
    private readonly supabase = inject(Supabase);

    loading = signal<boolean>(false);
    formError = signal<string | null>(null);

    unmatchedPasswordValidator: ValidatorFn = (control: AbstractControl) => {
        const password = control.get('password');
        const rePassword = control.get('rePassword');
        return password && rePassword && password.value === rePassword.value
            ? null
            : { unmatchedPasswords: true };
    };
    updatePasswordForm = new FormGroup(
        {
            password: new FormControl('', Validators.required),
            rePassword: new FormControl('', Validators.required),
        },
        { validators: this.unmatchedPasswordValidator }
    );

    onSubmit = async () => {
        try {
            this.loading.set(true);
            const newPassword = this.updatePasswordForm.value.password as string;
            const { error } = await this.supabase.updatePassword(newPassword);
            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                this.formError.set(error.message);
            }
        } finally {
            this.updatePasswordForm.reset();
            this.loading.set(false);
        }
    };
}
