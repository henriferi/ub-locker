import { Component, EnvironmentInjector, inject, ViewChild } from '@angular/core';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
  ],
})
export class TabsPage {
  @ViewChild(IonTabs, { static: false }) tabs!: IonTabs;

  public environmentInjector = inject(EnvironmentInjector);
  userType: any | null = ''; // Variável para armazenar o tipo de usuário

  ngOnInit() {
    const usuario = localStorage.getItem('locker_usuario');
    if(usuario) {
      const usuarioObj = JSON.parse(usuario);
      this.userType = usuarioObj.IDTIPOUSUARIO; 
    }
  }

  constructor(private router: Router) {
    addIcons({ triangle, ellipse, square });
  }


  irParaCadastro() {
    this.router.navigate(['/tabs/funcionario/cadastro']);
  }
}
