import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ModalController } from "@ionic/angular";
import { verificarAlunoModalPage } from "../modals/verificar-aluno-modal/verificar-aluno-modal.page";
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from "@angular/common/http";
import { environment } from "src/environments/environment";

@Component({
  standalone: true,
  selector: "app-qrcode",
  templateUrl: "./qrcode.page.html",
  styleUrls: ["./qrcode.page.scss"],
  imports: [CommonModule, IonicModule, HttpClientModule],
})
export class QrcodePage implements AfterViewInit, OnDestroy {
  TOKEN = environment.TOKEN;
  ApiURL = environment.apiUrl;
  scanner!: Html5QrcodeScanner;

  // ✅ Flag para controlar múltiplas leituras
  leituraEmAndamento = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient) {}

  async ngAfterViewInit() {
    setTimeout(() => {
      this.scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250 },
        false
      );

      this.scanner.render(
        (decodedText) => {
          if (!this.leituraEmAndamento) {
            this.leituraEmAndamento = true;
            this.buscarUsuarioPorCpf(decodedText);
          }
        },
        (error) => {
          // Apenas silencia o erro de leitura
        }
      );
    }, 100);
  }

  ngOnDestroy() {
    if (this.scanner) {
      this.scanner
        .clear()
        .catch((err) => console.error("Erro ao limpar scanner:", err));
    }
  }

  async abrirModal(dadosUsuario?: any) {
    const modal = await this.modalCtrl.create({
      component: verificarAlunoModalPage,
      componentProps: { usuario: dadosUsuario },
      breakpoints: [0, 0.4, 0.6],
      initialBreakpoint: 0.6,
      handle: true,
    });

    modal.onDidDismiss().then(() => {
      // Libera a leitura novamente após fechar o modal
      this.leituraEmAndamento = false;
    });

    await modal.present();
  }

  buscarUsuarioPorCpf(cpf: string) {
    const body = { CPFALUNO: cpf };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    this.http
      .post(`${this.ApiURL}/buscar-usuario`, body, { headers })
      .subscribe(
        (res: any) => {
          console.log("Usuário encontrado:", res);
          const dadosUsuario = res.resposta?.data?.usuario;
          if (dadosUsuario) {
            this.abrirModal(dadosUsuario);
          } else {
            this.leituraEmAndamento = false; // Libera leitura em caso de erro
          }
        },
        (err) => {
          console.error("Erro ao buscar usuário:", err);
          this.leituraEmAndamento = false; // Libera leitura em caso de erro
        }
      );
  }
}
