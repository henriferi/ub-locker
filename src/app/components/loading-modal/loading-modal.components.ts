// src/app/shared/components/loading-modal/loading-modal.component.ts
import { Component } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-loading-modal",
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <div class="loading-container">
      <ion-spinner name="lines-small"></ion-spinner>
      <p>Carregando...</p>
    </div>
  `,
  styles: [
    `
      .loading-container {
        position: absolute;
        inset: 0; /* shorthand para top:0; right:0; bottom:0; left:0 */
        width: 100%;
        height: 100%;
        background: rgba(
          0,
          0,
          0,
          0.8
        ); /* fundo escuro com leve transparência */
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        z-index: 9999;
        color: #fff;
      }
    `,
  ],
})
export class LoadingModalComponent {}
