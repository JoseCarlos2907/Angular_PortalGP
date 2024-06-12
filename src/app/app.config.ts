import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideClientHydration(), 
    provideHttpClient(withFetch()), 
    provideAnimationsAsync(), 
    provideFirebaseApp(() => 
      initializeApp({
        "projectId":"portalgp-fb", 
        "appId":"1:219079340524:web:5bc62f6b3adb7b48b750c9", 
        "storageBucket":"portalgp-fb.appspot.com", 
        "apiKey":"AIzaSyBlWBlTQomhtHqoC-CmjCoC9osYaMNTEgA", 
        "authDomain":"portalgp-fb.firebaseapp.com", 
        "messagingSenderId":"219079340524"
      })), 
    provideAuth(() => 
      getAuth()),
      { provide: FIREBASE_OPTIONS, useValue: {
      "projectId":"portalgp-fb", 
      "appId":"1:219079340524:web:5bc62f6b3adb7b48b750c9", 
      "storageBucket":"portalgp-fb.appspot.com", 
      "apiKey":"AIzaSyBlWBlTQomhtHqoC-CmjCoC9osYaMNTEgA", 
      "authDomain":"portalgp-fb.firebaseapp.com", 
      "messagingSenderId":"219079340524"}},
  ],
};
