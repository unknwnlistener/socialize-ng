import { Component, inject, signal } from '@angular/core';
import { Supabase } from '../supabase';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrls: ['./login.css', '../auth.css'],
})
export default class Login {
    private auth = inject(Supabase);
    private router = inject(Router);

    loading = signal<boolean>(false);
    formError = signal<string | null>(null);

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
    });

    onSubmit = async () => {
        try {
            this.loading.set(true);
            const email = this.loginForm.value.email as string;
            const password = this.loginForm.value.password as string;
            const { error } = await this.auth.signIn(email, password);
            if (error) {
                throw error;
            } else {
                this.router.navigate(['']);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
                this.formError.set(error.message);
            }
        } finally {
            this.loginForm.reset();
            this.loading.set(false);
        }
    };
}
