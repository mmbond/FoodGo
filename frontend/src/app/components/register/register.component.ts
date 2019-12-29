import { Component, OnInit } from '@angular/core';
import { CustomerRegistration } from 'src/app/models/customer-registration.model';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  customer: CustomerRegistration;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;
  mobNumberPattern = "^((\\+381-?)|0)+[0-9]{8,9}$";

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService) {
    this.customer = ({} as CustomerRegistration);
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      againPassword: ['', [Validators.required, Validators.minLength(8)]],
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required]
      //});
    }, { validators: passwordsDontMatch });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.customer.email = this.f.email.value;
    this.customer.password = this.f.password.value;
    this.customer.firstName = this.f.name.value;
    this.customer.lastName = this.f.lastname.value;
    this.customer.phone = this.f.phone.value;
    this.customer.address = this.f.address.value;
    this.loading = true;
    this.authenticationService.register(this.customer)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          //this.alertService.error(error);
          this.loading = false;
        });
  }
}

export const passwordsDontMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const againPassword = control.get('againPassword');

  return password.value === againPassword.value ? null : { 'passwordsDontMatch': true };
};