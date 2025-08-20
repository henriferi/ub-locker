import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-desvincular-modal',
  templateUrl: './desvincular-modal.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class DesvincularModalPage {

  constructor(
    private modalController: ModalController,
    private router: Router
  ) { }

  cancel() {
    this.modalController.dismiss();
  }

  confirm() {
    localStorage.clear();
    this.modalController.dismiss();
    this.router.navigateByUrl('tabs/funcionario/home', { replaceUrl: true });
  }
}
