import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule, ToastController, ModalController, NavController } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { environment } from "src/environments/environment";
import { LoadingModalComponent } from "../components/loading-modal/loading-modal.components";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class LoginPage implements OnInit {
  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  senhaVisivel = false;
  cpf = "";
  senha = "";

  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  toggleSenha() {
    this.senhaVisivel = !this.senhaVisivel;
  }

  async presentLoadingModal() {
    const modal = await this.modalCtrl.create({
      component: LoadingModalComponent,
      cssClass: "modal-loading-login",
      showBackdrop: false,
      backdropDismiss: false,
    });
    await modal.present();
    return modal;
  }

  async presentToast(message: string, color: string = "danger") {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: "top",
      color,
      cssClass: "toast-custom-text",
    });
    await toast.present();
  }

  async login() {
    const loadingModal = await this.presentLoadingModal();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    const body = {
      CPF: this.cpf,
      SENHA: this.senha,
    };

    try {
      const response: any = await firstValueFrom(
        this.http.post(`${this.apiUrl}/autenticacao/login`, body, { headers })
      );

      await loadingModal.dismiss();

      if (response?.resposta?.error || !response?.resposta?.data.usuario) {
        const msg = response?.resposta?.toast?.mensagem || "Erro ao fazer login.";
        await this.presentToast(msg);
        return;
      }

      const usuario = response.resposta.data.usuario;
      localStorage.setItem("locker_usuario", JSON.stringify(usuario));

      if (usuario.IDTIPOUSUARIO === 3) {
        this.navCtrl.navigateRoot("/tabs/funcionario/home", { animated: false });
      } else {
        this.navCtrl.navigateRoot("/tabs/aluno/home", { animated: false });
      }

    } catch (error) {
      await loadingModal.dismiss();
      await this.presentToast("Erro de conexão com o servidor.");
      console.error("Erro no login:", error);
    }
  }
}
