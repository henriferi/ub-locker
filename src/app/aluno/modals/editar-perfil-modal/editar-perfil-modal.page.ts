import { Component, Input } from "@angular/core";
import { IonicModule, ModalController, ToastController } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { UsuarioService } from "src/app/services/usuario.service";

@Component({
  selector: "app-editar-perfil-modal",
  templateUrl: "./editar-perfil-modal.page.html",
  styleUrls: ["./editar-perfil-modal.page.scss"],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class EditarPerfilModalPage {
  @Input() dadosAluno: any;

  NomeAluno: string = "";
  EmailAluno: string = "";
  TelefoneAluno: string = "";
  DtNascimento: string = "";

  telefoneInvalido: boolean = false;
  camposInvalidos: boolean = false;

  TOKEN = environment.TOKEN;
  apiUrl = environment.apiUrl;

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private usuarioService: UsuarioService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.NomeAluno = this.dadosAluno?.NOME || "";
    this.EmailAluno = this.dadosAluno?.EMAIL || "";
    this.TelefoneAluno = this.formatarTelefoneBR(
      this.dadosAluno?.TELEFONE || ""
    );
    this.DtNascimento = this.formatarDataBR(
      this.dadosAluno?.DTNASCIMENTO || ""
    );

    this.validarTelefone();
  }

  formatarDataBR(dataISO: string): string {
    if (!dataISO) return "";
    const partes = dataISO.split("-");
    if (partes.length !== 3) return dataISO;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

    aplicarMascaraData(event: any) {
    let valor = event.detail.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    if (valor.length > 4)
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    this.DtNascimento = valor;
  }

  formatarTelefoneBR(telefone: string): string {
    if (!telefone) return "";
    const num = telefone.replace(/\D/g, "");
    if (num.length !== 11) return telefone;
    return `(${num.substring(0, 2)}) ${num.substring(2, 3)} ${num.substring(
      3,
      7
    )}-${num.substring(7, 11)}`;
  }

    aplicarMascaraTelefone(event: any) {
    let valor = event.detail.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
    if (valor.length > 6) valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    this.TelefoneAluno = valor;
  }

  validarTelefone() {
    const numeroLimpo = this.TelefoneAluno.replace(/\D/g, "");
    this.telefoneInvalido = numeroLimpo.length > 0 && numeroLimpo.length < 11;
  }

  emailValido(): boolean {
    const email = this.EmailAluno.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  validarEmail() {
    this.camposInvalidos = false;
  }

  dataNascimentoValida(): boolean {
    const dataStr = this.DtNascimento.trim();
    const partes = dataStr.split("/");

    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1;
    const ano = parseInt(partes[2], 10);

    const dataNasc = new Date(ano, mes, dia);
    const hoje = new Date();

    return (
      !isNaN(dataNasc.getTime()) &&
      dataNasc <= hoje &&
      dataNasc.getFullYear() > 1900
    );
  }

  validarDataNascimento() {
    this.camposInvalidos = false;
  }

  fecharModal() {
    this.modalCtrl.dismiss();
  }

  async salvar() {
    const telefoneLimpo = this.TelefoneAluno.replace(/\D/g, "");

    // Validação do telefone
    if (telefoneLimpo.length > 0 && telefoneLimpo.length < 11) {
      this.telefoneInvalido = true;
      this.camposInvalidos = true;
      await this.presentToast(
        "Telefone inválido. Corrija antes de salvar.",
        "danger"
      );
      return;
    }

    // Validação do e-mail
    if (!this.emailValido()) {
      this.camposInvalidos = true;
      await this.presentToast(
        "E-mail inválido. Corrija antes de salvar.",
        "danger"
      );
      return;
    }

    // Validação da data de nascimento
    if (!this.dataNascimentoValida()) {
      this.camposInvalidos = true;
      await this.presentToast(
        "A data de nascimento não pode ser maior que a data atual.",
        "danger"
      );
      return;
    }

    const payload = {
      CPF: this.dadosAluno.CPF,
      NOME: this.NomeAluno,
      EMAIL: this.EmailAluno,
      DTNASCIMENTO: this.DtNascimento,
      TELEFONE: telefoneLimpo,
    };

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    this.http
      .post(`${this.apiUrl}/aluno/atualizar-perfil`, payload, { headers })
      .subscribe({
        next: async (res: any) => {
          const dadosAtualizados = {
            ...this.dadosAluno,
            NOME: this.NomeAluno,
            EMAIL: this.EmailAluno,
            DTNASCIMENTO: this.DtNascimento,
            TELEFONE: telefoneLimpo,
          };

          this.usuarioService.setAlunoStorage(dadosAtualizados);

          await this.presentToast("Perfil atualizado com sucesso!", "success");
          this.modalCtrl.dismiss({ atualizado: true });
        },
        error: async (err) => {
          console.error("Erro ao atualizar perfil:", err);
          await this.presentToast("Erro ao atualizar perfil.", "danger");
        },
      });
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
}
