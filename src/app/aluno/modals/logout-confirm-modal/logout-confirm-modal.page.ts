import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-confirm-modal',
  templateUrl: './logout-confirm-modal.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class LogoutConfirmModalPage {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  cancel() {
    this.modalController.dismiss();
  }

  confirm() {
    localStorage.clear();
    this.modalController.dismiss();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
