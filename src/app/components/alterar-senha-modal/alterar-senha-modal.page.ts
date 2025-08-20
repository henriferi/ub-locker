import { Component } from "@angular/core";
import {
  ModalController,
  AlertController,
  ToastController,
  IonicModule,
} from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-alterar-senha-modal",
  standalone: true,
  templateUrl: "./alterar-senha-modal.page.html",
  styleUrls: ["./alterar-senha-modal.page.scss"],
  imports: [CommonModule, IonicModule, FormsModule],
})
export class AlterarSenhaModalPage {
  senhaAtual: string = "";
  novaSenha: string = "";
  confirmarSenha: string = "";

  apiUrl = environment.apiUrl;
  TOKEN = environment.TOKEN;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  cancelar() {
    this.modalController.dismiss();
  }

  async alterarSenha() {
    if (!this.senhaAtual || !this.novaSenha || !this.confirmarSenha) {
      return this.presentToast("Preencha todos os campos.", "danger");
    }

    if (this.novaSenha !== this.confirmarSenha) {
      return this.presentToast("As senhas informadas não coincidem.", "danger");
    }

    if(this.senhaAtual === this.novaSenha) {
      return this.presentToast("A nova senha não pode ser igual a anterior", "danger");
    }

    const CPF = this.usuarioService.getCPFAluno();

    const payload = {
      CPF: CPF,
      SENHA_ATUAL: this.senhaAtual,
      SENHA: this.novaSenha,
      CONFIRMARSENHA: this.confirmarSenha,
    };

    const headers = new HttpHeaders({
      "Content-type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    this.http
      .post(`${this.apiUrl}/autenticacao/atualizar-senha`, payload, { headers })
      .subscribe({
        next: async (res: any) => {
          if (res?.resposta?.error) {
            return this.presentToast(
              res?.resposta?.toast?.mensagem || "Erro ao alterar a senha.",
              "danger"
            );
          }

          await this.presentToast("Senha alterada com sucesso!", "success");
          this.modalController.dismiss();
        },
        error: async (err) => {
          console.error("Erro na requisição:", err);
          await this.presentToast(
            "Erro ao alterar a senha. Tente novamente.",
            "danger"
          );
        },
      });
  }

  async presentToast(message: string, color: string = "danger") {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      position: "top",
      color,
    });

    await toast.present();
  }
  async exibirAlerta(mensagem: string) {
    const alert = await this.alertController.create({
      header: "Atenção",
      message: mensagem,
      buttons: ["OK"],
    });

    await alert.present();
  }
}
