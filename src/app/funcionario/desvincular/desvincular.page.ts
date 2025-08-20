import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-desvincular",
  templateUrl: "./desvincular.page.html",
  styleUrls: ["./desvincular.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class DesvincularPage {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  cancel() {
    this.router.navigateByUrl("tabs/funcionario/home", { replaceUrl: true });
    console.log("Cancelou");
  }

  confirm() {
    this.router.navigateByUrl("tabs/funcionario/home", { replaceUrl: true });
    console.log("Confirmou");
  }
}
