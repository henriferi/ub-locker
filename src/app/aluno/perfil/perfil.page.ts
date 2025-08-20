import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { LogoutConfirmModalPage } from "../modals/logout-confirm-modal/logout-confirm-modal.page";
import { AlterarSenhaModalPage } from "../../components/alterar-senha-modal/alterar-senha-modal.page";
import { environment } from "src/environments/environment";
import { UsuarioService } from "src/app/services/usuario.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { EditarPerfilModalPage } from "../modals/editar-perfil-modal/editar-perfil-modal.page";

@Component({
  selector: "app-perfil",
  templateUrl: "./perfil.page.html",
  styleUrls: ["./perfil.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, LogoutConfirmModalPage],
})
export class PerfilPage {
  dadosAluno: any = null;

  NomeAluno: string = "";
  CpfAluno: string = "";
  RA: string = "";
  EmailAluno: string = "";
  TelefoneAluno: string = "";
  DtNascimento: string = "";
  CodCurso: string = "";

  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  constructor(
    private modalController: ModalController,
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    const aluno = this.usuarioService.getDadosUsuario(); 
    if (aluno) {
      this.dadosAluno = aluno;
      this.NomeAluno = this.dadosAluno.NOME;
      this.CpfAluno = this.formatarCPF(this.dadosAluno.CPF);
      this.RA = this.dadosAluno.RA || "Visitante";
      this.CodCurso = this.dadosAluno.CODCURSO || "Visitante";
      this.EmailAluno = this.dadosAluno.EMAIL || "";
      this.TelefoneAluno = this.formatarTelefoneBR(this.dadosAluno.TELEFONE);
      this.DtNascimento = this.formatarDataBR(this.dadosAluno.DTNASCIMENTO);
    }
  }

  formatarDataBR(dataISO: string): string {
    if (!dataISO) return "";

    const partes = dataISO.split("-"); // ['YYYY', 'MM', 'DD']
    if (partes.length !== 3) return dataISO;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  formatarTelefoneBR(telefone: string): string {
    if (!telefone) return "";

    // Remove tudo que não for número
    const num = telefone.replace(/\D/g, "");

    // Verifica se tem 11 dígitos (DDD + 9 dígitos)
    if (num.length !== 11) return telefone; // retorna original se formato inesperado

    // Formata: (xx) x xxxx-xxxx
    return `(${num.substring(0, 2)}) ${num.substring(2, 3)} ${num.substring(
      3,
      7
    )}-${num.substring(7, 11)}`;
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return "";

    const num = cpf.replace(/\D/g, "");
    if (num.length !== 11) return cpf;

    return num.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  buscarPerfil(cpf: string) {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    this.http
      .post(`${this.apiUrl}/aluno/perfil`, { CPF: cpf }, { headers })
      .subscribe({
        next: (res: any) => {
          this.dadosAluno = res?.resposta?.data.aluno || res;

          this.NomeAluno = this.dadosAluno.NOME;
          this.CpfAluno = this.formatarCPF(this.dadosAluno.CPF);
          this.RA = this.dadosAluno.RA || "Visitante";
          this.CodCurso = this.dadosAluno.CODCURSO || "Visitante";
          this.EmailAluno = this.dadosAluno.EMAIL || "";
          this.TelefoneAluno = this.formatarTelefoneBR(
            this.dadosAluno.TELEFONE
          );
          this.DtNascimento = this.formatarDataBR(this.dadosAluno.DTNASCIMENTO);
        },
        error: (err) => {
          console.error("Erro ao buscar perfil:", err);
        },
      });
  }

  async openEditarPerfilModal() {
    const modal = await this.modalController.create({
      component: EditarPerfilModalPage,
      componentProps: {
        dadosAluno: this.dadosAluno,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.atualizado) {
        const cpf = this.usuarioService.getCPFAluno();
        this.buscarPerfil(cpf);
      }
    });

    await modal.present();
  }

  async openLogoutModal() {
    const modal = await this.modalController.create({
      component: LogoutConfirmModalPage,
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      cssClass: "modal-confirm",
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
