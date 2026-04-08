import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  activeTab: 'login' | 'signup' = 'signup';

  // Reactive Forms
  loginForm: FormGroup;
  signupForm: FormGroup;

  // UI state
  loginLoading  = false;
  signupLoading = false;
  loginMsg      = '';
  loginMsgType  = '';
  signupMsg     = '';
  signupMsgType = '';
  showLoginPw   = false;
  showSignupPw  = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // If already logged in, go to dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    // Build login form with validators
    this.loginForm = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Build signup form with validators matching backend @Pattern
    this.signupForm = this.fb.group({
      name:     ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,15}$/)
      ]]
    });
  }

  switchTab(tab: 'login' | 'signup'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.loginMsg = '';
    this.signupMsg = '';
  }

  // Convenience getters for template
  get lf() { return this.loginForm.controls; }
  get sf() { return this.signupForm.controls; }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loginLoading = true;
    this.loginMsg = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loginMsg     = '✓ Login successful! Redirecting...';
        this.loginMsgType = 'success';
        setTimeout(() => this.router.navigate(['/dashboard']), 700);
      },
      error: (err) => {
        this.loginMsg     = err.error?.message || 'Invalid credentials. Please try again.';
        this.loginMsgType = 'error';
        this.loginLoading = false;
      }
    });
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
    this.signupLoading = true;
    this.signupMsg = '';

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.signupMsg     = '✓ Account created! Please login.';
        this.signupMsgType = 'success';
        this.signupForm.reset();
        this.signupLoading = false;
        setTimeout(() => this.switchTab('login'), 1200);
      },
      error: (err) => {
        this.signupMsg     = err.error?.message || 'Signup failed. Email may already be registered.';
        this.signupMsgType = 'error';
        this.signupLoading = false;
      }
    });
  }
}
