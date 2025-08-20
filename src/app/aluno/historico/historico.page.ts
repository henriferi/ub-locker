import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  IonicModule,
  ModalController,
  ToastController,
} from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { HistoricoModalPage } from "../modals/historico-modal/historico-modal.page";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UsuarioService } from "src/app/services/usuario.service";
import { LoadingModalComponent } from "../../components/loading-modal/loading-modal.components";

interface Historico {
  Nome: string;
  Armario: string;
  Entrada: string;
  FuncionarioVinculo: string;
  FuncionarioDesvinculo: string;
  Local: string;
  Saida: string;
}

@Component({
  selector: "app-historico",
  templateUrl: "./historico.page.html",
  styleUrls: ["./historico.page.scss"],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
})
export class HistoricoPage implements OnInit {
  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  DadosAluno = this.usuarioService.getDadosUsuario() as any;
  IdAluno = this.DadosAluno.ID;
  CpfAluno = this.DadosAluno.CPF;

  historico: Historico[] = [];

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.Historico(); // Sempre faz requisição ao entrar
  }

  async presentLoadingModal() {
    const modal = await this.modalController.create({
      component: LoadingModalComponent,
      cssClass: "modal-loading-login", // mesma classe do login
      showBackdrop: false,
      backdropDismiss: false,
    });
    await modal.present();
    return modal;
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

  async Historico() {
    const loading = await this.presentLoadingModal();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    const body = {
      IDALUNO: this.IdAluno,
      CPFALUNO: this.CpfAluno,
    };

    this.http
      .post(`${this.apiUrl}/aluno/historico`, body, { headers })
      .subscribe({
        next: async (res: any) => {
          await loading.dismiss();

          if (res?.resposta?.error) {
            return this.presentToast(
              res?.resposta?.toast?.mensagem || "Erro ao buscar histórico.",
              "danger"
            );
          }

          const historicoBruto = res?.resposta?.data?.historico || [];

          this.historico = historicoBruto.map(
            (item: any): Historico => ({
              Nome: item.ALUNO,
              Armario: item.ARMARIO,
              Entrada: item.ENTRADA,
              FuncionarioVinculo: item.FUNCIONARIO_QUE_VINCULOU,
              FuncionarioDesvinculo: item.FUNCIONARIO_QUE_DESVINCULOU,
              Local: item.LOCAL,
              Saida: item.SAIDA,
            })
          );

          localStorage.setItem(
            "historicoAluno",
            JSON.stringify(this.historico)
          );
        },
        error: async (err) => {
          await loading.dismiss();
          console.error("Erro na requisição:", err);
          await this.presentToast(
            "Erro ao buscar histórico. Tente novamente.",
            "danger"
          );
        },
      });
  }

  async abrirModal(item: Historico) {
    const modal = await this.modalController.create({
      component: HistoricoModalPage,
      componentProps: {
        nome: item.Nome,
        armario: item.Armario,
        entrada: item.Entrada,
        saida: item.Saida,
        funcionarioVinculo: item.FuncionarioVinculo,
        funcionarioDesvinculo: item.FuncionarioDesvinculo,
        local: item.Local,
      },
      breakpoints: [0, 0.5, 1],
      initialBreakpoint: 0.5,
      cssClass: "historico-modal",
    });

    await modal.present();
  }
}
