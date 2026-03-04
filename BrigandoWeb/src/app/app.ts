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
    const nthCard = document.getElementById('nth-studios-card');
    const soarerCard = document.getElementById('soarer-cycles-card');
    const btechCard = document.getElementById('brigando-tech-card');
    const brnCard = document.getElementById('brn-robots-card');

    this.setupListeners(nthCard, 'nth-hovered-bg');
    this.setupListeners(soarerCard, 'soarer-hovered-bg');
    this.setupListeners(btechCard, 'btech-hovered-bg');
    this.setupListeners(brnCard, 'brn-hovered-bg');
  }

  private setupListeners(element: HTMLElement | null, classToAdd: string) : void {
    if (element !== null) {
      element.addEventListener('mouseover', function () {
        document.body.classList.add(classToAdd);
      });

      element.addEventListener('mouseout', function () {
        document.body.classList.remove(classToAdd);
      });
    }
  }
}
