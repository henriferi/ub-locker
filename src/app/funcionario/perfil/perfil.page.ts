import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { LogoutConfirmModalPage } from '../../aluno/modals/logout-confirm-modal/logout-confirm-modal.page';
import { AlterarSenhaModalPage } from "../../components/alterar-senha-modal/alterar-senha-modal.page";
import { UsuarioService } from '../../services/usuario.service';

interface Usuario {
  ID: number;
  NOME: string;
  CPF: string;
  DTNASCIMENTO: string;
  IDTIPOUSUARIO: number;
  TELEFONE: string;
  EMAIL: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, LogoutConfirmModalPage, AlterarSenhaModalPage],
})


export class PerfilPage {
  dadosUsuario!: Usuario;

  id: number = 0;
  nome: string = '';
  cpf: string = '';
  dtNascimento: string = '';
  idTipoUsuario: number = 0;
  telefone: string = '';
  email: string = '';

  constructor(private modalController: ModalController, private usuarioService: UsuarioService) {}

  ionViewWillEnter() {
    const usuario = this.usuarioService.getDadosUsuario() as Usuario; 
    this.dadosUsuario = usuario;

    this.id = usuario.ID;
    this.nome = usuario.NOME;
    this.cpf = usuario.CPF;
    this.dtNascimento = this.formatarData(usuario.DTNASCIMENTO);
    this.idTipoUsuario = usuario.IDTIPOUSUARIO;
    this.telefone = this.formatarTelefone(usuario.TELEFONE);
    this.email = usuario.EMAIL;
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarTelefone(telefone: string): string {
  const tel = telefone.replace(/\D/g, '');

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7)}`;
  } else if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
  } else {
    return telefone;
  }
}

  async openLogoutModal() {
    const modal = await this.modalController.create({
      component: LogoutConfirmModalPage,
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      cssClass: 'modal-confirm',
    });

    await modal.present();
  }

    async openAlterarSenhaModal() {
    const modal = await this.modalController.create({
      component: AlterarSenhaModalPage,
      breakpoints: [0, 0.5],
      initialBreakpoint: 0.5,
      cssClass: "alterar-senha-modal",
    });

    await modal.present();
  }
}
