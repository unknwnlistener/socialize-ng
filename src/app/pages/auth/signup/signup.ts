import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Supabase } from '../supabase';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-signup',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './signup.html',
    styleUrls: ['./signup.css', '../auth.css'],
})
export default class Signup {
    loading = signal<boolean>(false);
    formError = signal<string | null>(null);
    private auth = inject(Supabase);
    private router = inject(Router);

    signupForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        name: new FormControl('', Validators.required),
    });

    onSubmit = async () => {
        try {
            this.loading.set(true);
            const email = this.signupForm.value.email as string;
            const password = this.signupForm.value.password as string;
            const username = this.signupForm.value.username as string;
            const name = this.signupForm.value.name as string;
            const { error } = await this.auth.signUp(email, password, username, name);
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
            this.signupForm.reset();
            this.loading.set(false);
        }
    };
}
