import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";

@Component({
  selector: "app-dados-vinculo-modal",
  templateUrl: "./dados-vinculo-modal.page.html",
  styleUrls: ["./dados-vinculo-modal.page.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DadosVinculoModalPage {
  @Input() dadosVinculo: any;

  constructor(private modalController: ModalController) {}

  fechar() {
    this.modalController.dismiss();
  }
}
