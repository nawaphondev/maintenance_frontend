import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  trigger,
  transition,
  style,
  animate,
  group,
  query,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet], // นำเข้ามอดูลที่ต้องการ
  templateUrl: './app.component.html',
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          style({ position: 'absolute', width: '100%' }),
          { optional: true }
        ),
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateY(20px)' }),
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ],
            { optional: true }
          ),
          query(
            ':leave',
            [
              style({ opacity: 1 }),
              animate('500ms ease-in', style({ opacity: 0 })),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent {
  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.animation;
  }
}
