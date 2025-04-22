# To us enotification in angular
we can use  Ngxsweetalter2,ngx-toastr,  Angular Material Snackbar

# Sweetalert2

1. # npm i @sweetalert2/ngx-sweetalert2

2. In style.css or angular.json file import the css for sweetalert2 similar to bootstrap.

# @import "../node_modules/sweetalert2/dist/sweetalert2.min.css";


3. In app.config.ts file
under providers add SweetAlert2Module
=========================
Example
providers: [ SweetAlert2Module,
    provideHttpClient()]

3. In the file you have to use sweetalert notificaiton, fo the filename.ts file and import Swal from  js file of sweetalert2 present in nodemodules directly.

# import Swal from "sweetalert2/dist/sweetalert2.js"

4. Now you can use it on any button click

# An async function in JavaScript (and TypeScript) always returns a Promise by default, If you omit the return statement, the function will still return a Promise that resolves to undefined.

async logout(): Promise<void> {

       const result=await Swal.fire({
        title: 'Are you sure?',
        reverseButtons: true,
        text: 'You will be logged out!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
      })

      if(result.isConfirmed){
         localStorage.clear();
         this.router.navigate(['/login']);
      }
    
  }

# date in angualar

 <p class="card-text text-muted">{{ blog.createdAt | date: 'MMM d, y, h:mm a' }}</p>
 
## Explanation of the Format String
MMM: Abbreviated month name (e.g., "Oct").
d: Day of the month.
y: Full year (e.g., "2024").
h:mm: Hour in 12-hour format followed by minutes.
a: AM/PM marker.

# To use lottie animation in  Angular

npm install lottie-web ngx-lottie

## In app.config.ts file

import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({
      player: () => import('lottie-web'),
    }),
  ],
};


## Now in the component Ts file 

import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';

@Component({
  imports: [LottieComponent],
})

export class MyBlog{
 options: AnimationOptions = {
    path: 'https://lottie.host/9ef23ea9-e622-4b3a-a79e-b9d16ec7c8de/VnzAQYHWx6.json',
  };

  
  animationCreated(animationItem: AnimationItem): void {
        animationItem.setSpeed(2); //2 means double speed
  }

}

<!-- The animationCreated function is an event handler in Angular that allows you to interact with a Lottie animation after it has been loaded and initialized. This handler gives you access to the AnimationItem object, which represents the loaded animation and provides various methods to control it. 
Key Uses of animationCreated
Control Playback Speed
Play/Pause the Animation
Looping Control
etc.
-->

## Finally in Component HTML file
 <ng-lottie [options]="options" (animationCreated)="animationCreated($event)" />

# Guards in Angular

1. CanActivate: Restricts access to a route.
2. CanActivateChild: Restricts access to child routes of a given route.
3. CanDeactivate: Checks if you can leave the route.
4. CanMatch: Customizes the route-matching process

# The ! tells TypeScript "trust me, this will be defined at runtime", even though it can't guarantee that at compile time. 
@ViewChild('commentIcon') commentIcon!: ElementRef;