import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CodeRain } from './fx/code-rain';
import { Hud } from './fx/hud';
import { Intro } from './intro/intro';
import { IntroService } from './intro/intro.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Intro, CodeRain, Hud],
  templateUrl: './app.html',
})
export class App {
  protected readonly showIntro = inject(IntroService).visible;
}
