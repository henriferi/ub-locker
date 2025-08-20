import { Component } from "@angular/core";
import { IonicModule, ModalController, ToastController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { UsuarioService } from "../../services/usuario.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { LoadingModalComponent } from "../../components/loading-modal/loading-modal.components";

interface RegistroLocker {
  nome: string;
  dataHora: string;
  locker: string;
  armario: number;
  vinculadoPorMim: boolean;
  desvinculadoPorMim: boolean;
}

@Component({
  standalone: true,
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage {
  nomeFuncionario: string = "";
  idFunc: number = 0;

  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  registros: RegistroLocker[] = [];
  registrosVisiveis: RegistroLocker[] = [];

  tamanhoLote: number = 10;
  indiceAtual: number = 0;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private modalController: ModalController,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const id = this.usuarioService.getIdFuncionario();
    this.idFunc = id;

    console.log("ID do funcionário obtido:", id);

    if (!id) {
      this.presentToast("Funcionário não identificado!", "danger");
      return;
    }

    this.Registros(id);
  }

  async Registros(idFuncionario: number) {
    const loading = await this.presentLoadingModal();

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    const body = {
      IDCRIADO: idFuncionario,
      IDMODIFICADO: idFuncionario,
    };

    console.log("Enviando body:", body);

    this.http
      .post(`${this.apiUrl}/funcionarios/historico`, body, { headers })
      .subscribe({
        next: async (res: any) => {
          await loading.dismiss();

          console.log("Resposta da API:", res);

          const registrosBruto = res?.resposta?.data?.historico;

          if (!registrosBruto || registrosBruto.length === 0) {
            console.warn("Histórico está vazio.");
            return this.presentToast("Nenhum histórico encontrado.", "warning");
          }

          this.registros = registrosBruto
            .map(
              (item: any): RegistroLocker => ({
                nome: item.ALUNO,
                dataHora: item.HORARIO_ENTRADA,
                locker: item.LOCAL,
                armario: item.IDENTIFICACAO,
                vinculadoPorMim:
                  item.ID_VINCULADO_POR !== null &&
                  item.ID_VINCULADO_POR === this.idFunc,
                desvinculadoPorMim:
                  item.ID_DESVINCULADO_POR !== null &&
                  item.ID_DESVINCULADO_POR === this.idFunc,
              })
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
            );

          localStorage.setItem(
            "historico-funcionario",
            JSON.stringify(this.registros)
          );

          this.registrosVisiveis = [];
          this.indiceAtual = 0;
          this.carregarMais();
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

  async presentLoadingModal() {
    const modal = await this.modalController.create({
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
      duration: 2500,
      position: "top",
      color,
    });
    await toast.present();
  }

  ionViewWillEnter() {
    this.nomeFuncionario = this.usuarioService.getNomeFuncionario();
  }

  carregarMais(event?: any) {
    const fim = this.indiceAtual + this.tamanhoLote;
    const novos = this.registros.slice(this.indiceAtual, fim);

    this.registrosVisiveis.push(...novos);
    this.indiceAtual = fim;

    if (event) {
      event.target.complete();

      if (this.indiceAtual >= this.registros.length) {
        event.target.disabled = true;
      }
    }
  }

  irParaCadastro() {
    this.router.navigate(["tabs/funcionario/cadastro"]);
  }
}
