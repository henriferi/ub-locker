import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { UsuarioService } from "../../services/usuario.service";
import { ModalController } from "@ionic/angular";
import { LoadingModalComponent } from "../../components/loading-modal/loading-modal.components";
import { ConfirmarVinculoModalComponent } from "../../components/confirmar-vinculo-modal/confirmar-vinculo-modal.component";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";

interface LocalDeTrabalho {
  ID: number;
  LOCAL: string;
  STATUS: number | null;
  QUANTIDADE_TOTAL_ARMARIOS: number;
  QUANTIDADE_ARMARIOS_DISPONIVEIS: number;
}

@Component({
  selector: "app-lockers",
  templateUrl: "./lockers.page.html",
  styleUrls: ["./lockers.page.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule, ConfirmarVinculoModalComponent],
})
export class LockersPage implements OnInit {
  nomeFuncionario: string = "";
  locaisDeTrabalho: LocalDeTrabalho[] = [];
  locaisVinculados: LocalDeTrabalho[] = [];
  locaisNaoVinculados: LocalDeTrabalho[] = [];

  ApiUrl = environment.apiUrl;
  TOKEN = environment.TOKEN;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private modalCtrl: ModalController,
    private http: HttpClient
  ) {}

  async presentLoadingModal() {
    const modal = await this.modalCtrl.create({
      component: LoadingModalComponent,
      cssClass: "modal-loading-fullscreen",
      showBackdrop: false,
      backdropDismiss: false,
    });

    await modal.present();
    return modal;
  }

  ngOnInit() {
    this.nomeFuncionario = this.usuarioService.getNomeFuncionario();
    this.buscarLocaisDeTrabalho();
  }

  ionViewWillEnter() {
    this.nomeFuncionario = this.usuarioService.getNomeFuncionario();
  }

  buscarLocaisDeTrabalho() {
    const locaisStorage = localStorage.getItem("locais_de_trabalho");

    if (locaisStorage) {
      this.locaisDeTrabalho = JSON.parse(locaisStorage);
      this.atualizarListasSeparadas();
      return;
    }

    const IdFuncionario = this.usuarioService.getIdFuncionario();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.TOKEN}`,
    });

    const body = {
      ID_FUNCIONARIO: IdFuncionario,
    }

    this.http.post(`${this.ApiUrl}/locais`, body, { headers }).subscribe({
      next: (res: any) => {
        this.locaisDeTrabalho = res.resposta?.data?.locais || [];
        this.atualizarListasSeparadas();
        localStorage.setItem("locais_de_trabalho", JSON.stringify(this.locaisDeTrabalho));
      },
      error: (err) => {
        console.error("Erro ao buscar locais:", err);
      },
    });
  }

  async vincularLocker(local: LocalDeTrabalho) {
    const modal = await this.modalCtrl.create({
      component: ConfirmarVinculoModalComponent,
      componentProps: {
        titulo: "Vincular Locker",
        mensagem: `Deseja vincular-se ao Locker - ${local.LOCAL}?`,
        textoConfirmar: "Vincular",
        textoCancelar: "Cancelar",
        iconeConfirmar: "lock-closed-outline",
        iconeCancelar: "close-circle-outline",
      },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      cssClass: "confirm-modal",
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === true) {
      const loading = await this.presentLoadingModal();

      try {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.TOKEN}`,
        });

        const ID_FUNCIONARIO = this.usuarioService.getIdFuncionario();
        const ID_LOCAL = local.ID;

        const body = {
          ID_FUNCIONARIO,
          ID_LOCAL,
          CRIADO_POR: ID_FUNCIONARIO,
        };

        const res: any = await this.http
          .post(`${this.ApiUrl}/funcionarios/vincular`, body, { headers })
          .toPromise();

        const index = this.locaisDeTrabalho.findIndex((l) => l.ID === local.ID);
        if (index > -1) {
          this.locaisDeTrabalho[index].STATUS = 1;
        }

        this.atualizarLocalStorage();
        this.atualizarListasSeparadas();

      } catch (error) {
        console.error("Erro ao vincular funcionário ao local:", error);
      } finally {
        await loading.dismiss();
      }
    }
  }

  async desvincularLocker(local: LocalDeTrabalho) {
    const modal = await this.modalCtrl.create({
      component: ConfirmarVinculoModalComponent,
      componentProps: {
        titulo: "Desvincular Locker",
        mensagem: `Deseja desvincular-se do Locker - ${local.LOCAL}?`,
        textoConfirmar: "Desvincular",
        textoCancelar: "Cancelar",
        iconeConfirmar: "lock-open-outline",
        iconeCancelar: "close-circle-outline",
      },
      breakpoints: [0, 0.3],
      initialBreakpoint: 0.3,
      cssClass: "modal-confirm",
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data === true) {
      const loading = await this.presentLoadingModal();

      try {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.TOKEN}`,
        });

        const ID_FUNCIONARIO = this.usuarioService.getIdFuncionario();
        const ID_LOCAL = local.ID;

        const body = {
          ID_FUNCIONARIO,
          ID_LOCAL,
          MODIFICADO_POR: ID_FUNCIONARIO,
        };

        const res: any = await this.http
          .post(`${this.ApiUrl}/funcionarios/desvincular`, body, { headers })
          .toPromise();

        const index = this.locaisDeTrabalho.findIndex((l) => l.ID === local.ID);
        if (index > -1) {
          this.locaisDeTrabalho[index].STATUS = null;
        }

        this.atualizarLocalStorage();
        this.atualizarListasSeparadas();

      } catch (error) {
        console.error("Erro ao desvincular funcionário do local:", error);
      } finally {
        await loading.dismiss();
      }
    }
  }

  private atualizarLocalStorage() {
    localStorage.setItem("locais_de_trabalho", JSON.stringify(this.locaisDeTrabalho));
  }

  private atualizarListasSeparadas() {
    this.locaisVinculados = this.locaisDeTrabalho.filter((l) => l.STATUS === 1);
    this.locaisNaoVinculados = this.locaisDeTrabalho.filter((l) => l.STATUS !== 1);

    localStorage.setItem("locais_vinculados", JSON.stringify(this.locaisVinculados));

  }
}
