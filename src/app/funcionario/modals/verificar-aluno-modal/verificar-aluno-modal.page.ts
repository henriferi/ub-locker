import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  ModalController,
  IonicModule,
  ToastController,
  ActionSheetController,
} from "@ionic/angular";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UsuarioService } from "src/app/services/usuario.service";
import { DadosVinculoModalPage } from "src/app/funcionario/modals/dados-vinculo-modal/dados-vinculo-modal.page";

@Component({
  selector: "app-verificar-aluno-modal",
  templateUrl: "./verificar-aluno-modal.page.html",
  styleUrls: ["./verificar-aluno-modal.page.scss"],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
})
export class verificarAlunoModalPage implements OnInit {
  TOKEN = environment.TOKEN;
  APIURL = environment.apiUrl;
  @Input() usuario: any;

  NomeAluno: string = "";
  CpfAluno: string = "";
  RA: string = "";
  EmailAluno: string = "";
  CodCurso: string = "";
  IdAluno: string = "";
  DadosVinculo: string = "";
  vinculoAtivo: boolean = false;

  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    //   this.alunoMock = {
    //   NOME: "Biberson JR",
    //   CPF: "70147703069", // CPF de teste
    //   RA: "visitante",
    //   CODCURSO: "ADS",
    //   EMAIL: "bibersonjr24@gmail.com",
    //   ID: "89", // ID do aluno
    //   VINCULO_ATIVO: 0
    // };

    // this.preencherDados(this.alunoMock);

    if (this.usuario) {
      this.preencherDados(this.usuario);
    } else {
      this.exibirToast("Dados do aluno não foram recebidos.");
    }
  }

  preencherDados(aluno: any) {
    this.NomeAluno = aluno.NOME;
    this.CpfAluno = this.formatarCPF(aluno.CPF);
    this.RA = aluno.RA || "Visitante";
    this.CodCurso = aluno.CODCURSO || "Visitante";
    this.EmailAluno = aluno.EMAIL || "";
    this.IdAluno = aluno.ID;
    this.vinculoAtivo = aluno.VINCULO_ATIVO === 1;
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return "";
    const num = cpf.replace(/\D/g, "");
    if (num.length !== 11) return cpf;
    return num.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  async exibirToast(mensagem: string, cor: string = "danger") {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: cor,
      position: "bottom",
    });
    await toast.present();
  }

  async vincularAluno() {
    try {
      const locais = (await this.usuarioService.getLocaisVinculados()) as any[];

      if (!locais || locais.length === 0) {
        this.exibirToast("Nenhum local vinculado encontrado.");
        return;
      }

      const IDFUNCIONARIO = await this.usuarioService.getIdFuncionario();

      //Se o aluno já está vinculado, pega o local direto (sem escolher)
      if (this.vinculoAtivo) {
        const IDLOCAL = locais[0].ID;
        this.executarVinculo(IDLOCAL, IDFUNCIONARIO);
        return;
      }

      //Se aluno não está vinculado, mostra escolha de local se houver mais de 1
      if (locais.length === 1) {
        const IDLOCAL = locais[0].ID;
        this.executarVinculo(IDLOCAL, IDFUNCIONARIO);
      } else {
        const botoes = locais.map((local) => ({
          text: local.LOCAL,
          handler: () => {
            this.executarVinculo(local.ID, IDFUNCIONARIO);
          },
        }));

        const actionSheet = await this.actionSheetController.create({
          header: "Escolha o local para vincular",
          cssClass: "action-vincular-lockers",
          buttons: [...botoes, { text: "Cancelar", role: "cancel" }],
        });

        await actionSheet.present();
      }
    } catch (err) {
      console.error(err);
      this.exibirToast("Erro ao obter informações para vincular.");
    }
  }

  async executarVinculo(IDLOCAL: string, IDFUNCIONARIO: string) {
    try {
      const body = {
        CPFALUNO: this.usuario.CPF,
        IDALUNO: this.usuario.ID,
        IDLOCAL,
        IDFUNCIONARIO,
      };

      const headers = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.TOKEN}`,
      });

      this.http
        .post(`${this.APIURL}/vincular-aluno`, body, { headers })
        .subscribe({
          next: async (res: any) => {
            this.DadosVinculo = res?.resposta?.data?.vinculo;
            if (this.DadosVinculo) {
              const acao = this.vinculoAtivo ? "desvinculado" : "vinculado";
              this.exibirToast(`Aluno ${acao} com sucesso!`, "success");

              // Mostrar modal de dados do vínculo sempre que existir dados, independente de vínculo ativo
              const modal = await this.modalController.create({
                component: DadosVinculoModalPage,
                componentProps: {
                  dadosVinculo: this.DadosVinculo,
                },
                breakpoints: [0, 0.4, 0.6],
                initialBreakpoint: 0.6,
                handle: true,
              });
              await modal.present();
              await modal.onDidDismiss();
            } else {
              const toast = res?.resposta?.toast?.mensagem || "Ação concluída.";
              this.exibirToast(toast);
            }

            this.modalController.dismiss(true);
          },
          error: (err) => {
            console.error(err);
            this.exibirToast("Erro ao vincular aluno.");
          },
        });
    } catch (err) {
      console.error(err);
      this.exibirToast("Erro ao vincular aluno.");
    }
  }

  fechar() {
    this.modalController.dismiss();
  }
}
