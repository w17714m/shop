import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, ReplaySubject, of, interval} from 'rxjs';
import {IUser} from 'src/app/models/User';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {IAddress} from 'src/app/models/Address';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  userTemp: IUser = {
    email: '',
    displayName: '',
    token: '' + (Math.random() * 100)
  };
  baseUrl = environment.apiUrl;
  // We need to have something which won't emit initial value rather wait till it has something.
  // Hence for that ReplaySubject. I have given to hold one user object and it will cache this as well
  private currentUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currentUserSource.asObservable();


  constructor(private http: HttpClient, private router: Router) {
  }


  loadCurrentUser(token: string) {
    if (token === null) {

      this.currentUserSource.next(
      );
      localStorage.setItem('token', this.userTemp.token);
      this.currentUserSource.next(this.userTemp);
      return of(this.userTemp);
    }
    return of(this.userTemp).pipe(
      map(x =>{
        interval(3000);
        return x;
      } )
    );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + 'account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + 'account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + 'account/emailexists?email=' + email);
  }

  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
}
