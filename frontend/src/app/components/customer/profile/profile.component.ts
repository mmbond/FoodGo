import { Component, OnInit } from '@angular/core';
import { CustomerProfile } from 'src/app/models/customer-profile.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  private customer : CustomerProfile;
  profileForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  hide = true;
  showForm = false;
  mobNumberPattern = "^((\\+381)|0)+[0-9]{8,9}$";
  addressPattern = "^([A-z]+\\s)+([1-9]|[1-9][0-9]{1,2})[a-z]{0,1}$";
  
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private customerService: CustomerService) {
    this.customer = JSON.parse(localStorage.getItem('customer'));
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      email: [this.customer.email, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      name: [this.customer.firstName, Validators.required],
      lastname: [this.customer.lastName, Validators.required],
      phone: [this.customer.phone, Validators.required]
    }, { validator: passwordsMustMatch('password', 'confirmPassword') });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.profileForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.profileForm.invalid) {
      return;
    }

    this.customer.email = this.f.email.value;
    this.customer.firstName = this.f.name.value;
    this.customer.lastName = this.f.lastname.value;
    this.customer.phone = this.f.phone.value;
    this.loading = true;
    console.log(this.customer);
    this.customerService.updateCustomer(this.customer)
    .pipe(first())
    .subscribe(
      data => {
        this.showForm = false;
        this.loading = false;
        this.profileForm.reset({
          email: this.customer.email,
          name: this.customer.firstName,
          lastname: this.customer.lastName,
          phone: this.customer.phone
        });
        (this as{submitted:boolean}).submitted = false;
      },
      error => {
        this.showForm = true;
      });
      
  }

  private editProfile() : boolean {
    return this.showForm;
  }
}

// custom validator to check that two fields match
export function passwordsMustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if ((control.errors  && !control.hasError('passwordsMustMatch'))  || (matchingControl.errors && !matchingControl.hasError('passwordsMustMatch'))) {
        return;
    }
    // set error on controlers if validation fails
    if (control.value !== matchingControl.value) {
      control.setErrors({passwordsMustMatch: true });
      matchingControl.setErrors({ passwordsMustMatch: true });
    } else {
      control.setErrors(null);
      matchingControl.setErrors(null);
    }
  }
}