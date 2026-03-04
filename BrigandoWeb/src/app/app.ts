import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('Brigando');
  
  ngOnInit(): void {
    console.log("TRYING");
    const soarerCard = document.getElementById('soarer-cycles-card');
    const pageBody = document.body;

    if (soarerCard !== null) {
      console.log("GOT");
      soarerCard.addEventListener('mouseover', function () {
        console.log("GOT")
        pageBody.classList.add('soarer-hovered-bg');
      });

      soarerCard.addEventListener('mouseout', function () {
        console.log("NOT GOT")
        pageBody.classList.remove('soarer-hovered-bg');
      });
    }
    else {
      console.log("NOT EL FOUND");
    }
  }
}
