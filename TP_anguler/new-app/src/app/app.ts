import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  number : number = 0;
  increment():void{
    this.number++;
  }
  decrement():void{
    this.number--;

  }
  reset():void{
    this.number= 0;
  }
  
}
