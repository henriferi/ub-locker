import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { IonicModule, ModalController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Router } from "@angular/router";
import QRCode from "qrcode";
import { UsuarioService } from "../../services/usuario.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LoadingModalComponent } from "../../components/loading-modal/loading-modal.components";

@Component({
  selector: "app-aluno",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  // Dados do aluno
  nomeAluno: string = "";
  cpfAluno: string = "";
  RAAluno: string = "";
  IdAluno: string = "";

  // Dados do vínculo
  local: string = "";
  armario: string = "";
  funcionario: string = "";
  entrada: string = "";

  hasLocker: boolean = false;
  remainingTime: string = "";
  tempoRestanteSegundos: number = 0;
  intervalId: any;

  vinculo: any = null;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private modalController: ModalController // Importado ModalController
  ) {}

  ngOnInit() {
    this.verificarVinculo();
    const DadosUsuario = this.usuarioService.getDadosUsuario() as any;

    this.nomeAluno = DadosUsuario?.NOME;
    this.cpfAluno = DadosUsuario?.CPF;
    this.RAAluno = DadosUsuario?.RA || "Visitante";
    this.IdAluno = DadosUsuario?.ID;
  }

  ngAfterViewInit() {
    this.generateQrCode();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  /** Apresenta modal de loading */
  async presentLoadingModal() {
    const modal = await this.modalController.create({
      component: LoadingModalComponent,
      cssClass: "modal-loading-login", // mesma classe do histórico
      showBackdrop: false,
      backdropDismiss: false,
    });
    await modal.present();
    return modal;
  }

  /** Faz a requisição para buscar vínculo sempre que abrir a home */
  async verificarVinculo() {
    const loading = await this.presentLoadingModal(); // mostra loading

    const cpf = this.usuarioService.getCPFAluno();
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });
    const body = { CPFALUNO: cpf };

    this.http
      .post<any>(`${this.apiUrl}/aluno/vinculo`, body, { headers })
      .subscribe({
        next: async (res) => {
          await loading.dismiss(); // esconde loading

          if (res?.resposta?.data?.vinculoAtual) {
            this.setVinculoData(res.resposta.data.vinculoAtual);
          } else {
            // Sem vínculo
            this.hasLocker = false;
            this.vinculo = null;
            clearInterval(this.intervalId);
            this.remainingTime = "";
          }
        },
        error: async (err) => {
          await loading.dismiss(); // esconde loading mesmo em erro
          console.error("Erro ao buscar vínculo:", err);
        },
      });
  }

  /** Preenche as variáveis com dados do vínculo */
  setVinculoData(vinculo: any) {
    this.vinculo = vinculo;
    this.local = vinculo.LOCAL;
    this.armario = vinculo.ARMARIO;
    this.funcionario = vinculo.FUNCIONARIO_QUE_VINCULOU;
    this.entrada = vinculo.ENTRADA;

    // Tempo decrescente a partir de 4 horas
    this.tempoRestanteSegundos = 4 * 60 * 60 - vinculo.TEMPO_VINCULO_EM_SEGUNDOS;

    this.hasLocker = true;
    this.startCountdown();
  }

  /** Gera QR Code */
  generateQrCode() {
    this.cpfAluno = this.usuarioService.getCPFAluno();
    const canvasElement = document.getElementById("canvas-qr") as HTMLCanvasElement;
    if (canvasElement) {
      QRCode.toCanvas(
        canvasElement,
        this.cpfAluno,
        {
          width: 280,
          color: { dark: "#192A56", light: "#002a7600" },
        },
        (error: any) => error && console.error("Erro ao gerar QR:", error)
      );
    }
  }

  /** Inicia contagem regressiva */
  startCountdown() {
    this.updateRemainingTime();
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.tempoRestanteSegundos--;
      this.updateRemainingTime();
      if (this.tempoRestanteSegundos <= 0) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  /** Atualiza exibição do tempo restante */
  updateRemainingTime() {
    if (this.tempoRestanteSegundos <= 0) {
      this.remainingTime = "00h 00m 00s";
      return;
    }
    const hours = Math.floor(this.tempoRestanteSegundos / 3600);
    const minutes = Math.floor((this.tempoRestanteSegundos % 3600) / 60);
    const seconds = this.tempoRestanteSegundos % 60;
    this.remainingTime = `${this.formatTime(hours)}h ${this.formatTime(minutes)}m ${this.formatTime(seconds)}s`;
  }

  formatTime(value: number): string {
    return value < 10 ? "0" + value : value.toString();
  }

  toProfile() {
    this.router.navigate(["/aluno/perfil"]);
  }
}
