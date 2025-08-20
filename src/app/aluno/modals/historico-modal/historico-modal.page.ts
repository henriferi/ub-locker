import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";

@Component({
  standalone: true,
  selector: "app-historico-modal",
  templateUrl: "./historico-modal.page.html",
  imports: [CommonModule, IonicModule],
})
export class HistoricoModalPage {
  @Input() nome!: string;
  @Input() armario!: string;
  @Input() entrada!: string;
  @Input() saida!: string | null;
  @Input() funcionarioVinculo!: string;
  @Input() funcionarioDesvinculo!: string;
  @Input() local!: string;

  constructor(private modalCtrl: ModalController) {}

  fechar() {
    this.modalCtrl.dismiss();
  }
}
