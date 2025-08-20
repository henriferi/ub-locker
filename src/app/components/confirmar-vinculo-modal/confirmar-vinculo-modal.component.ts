import { Component, Input } from "@angular/core";
import { IonicModule, ModalController } from "@ionic/angular";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-confirmar-vinculo-modal",
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: "./confirmar-vinculo-modal.component.html",
})
export class ConfirmarVinculoModalComponent {
  @Input() titulo: string = "Confirmar ação";
  @Input() mensagem: string = "Deseja realmente realizar esta ação?";
  @Input() textoConfirmar: string = "Confirmar";
  @Input() textoCancelar: string = "Cancelar";
  @Input() iconeConfirmar: string = "checkmark-outline";
  @Input() iconeCancelar: string = "close-outline";

  constructor(private modalCtrl: ModalController) {}

  confirmar() {
    this.modalCtrl.dismiss(true);
  }

  cancelar() {
    this.modalCtrl.dismiss(false);
  }
}
