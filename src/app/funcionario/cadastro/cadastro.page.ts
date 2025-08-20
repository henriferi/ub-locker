import { Component } from "@angular/core";
import { IonicModule, AlertController, ToastController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { UsuarioService } from "../../services/usuario.service";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ModalController } from "@ionic/angular";
import { verificarAlunoModalPage } from "../modals/verificar-aluno-modal/verificar-aluno-modal.page";

@Component({
  selector: "app-cadastro",
  templateUrl: "./cadastro.page.html",
  styleUrls: ["./cadastro.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class CadastroPage {
  nomeFuncionario: string = "";
  cpfDigitado: string = "";
  usuario: any = {
    nome: "",
    telefone: "",
    email: "",
    curso: "",
    dtnascimento: "",
    ra: "",
    cpf: "",
    id: null,
  };

  emailValido: boolean | null = null;
  exibirFormulario: boolean = false;
  telefoneValido: boolean | null = null;
  curso: string | null = null;

  TOKEN = environment.TOKEN;
  APIURL = environment.apiUrl;
  // ✅ Flag para controlar múltiplas leituras
  leituraEmAndamento = false;

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private toastController: ToastController,
    private http: HttpClient,
    private modalCtrl: ModalController
  ) {}

  ionViewWillEnter() {
    this.nomeFuncionario = this.usuarioService.getNomeFuncionario();
  }

  validarEmail(email: string): boolean {
    if (!email || email.trim() === "") {
      this.emailValido = null; // vazio = sem erro
      return false;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailValido = re.test(email.toLowerCase());
    return this.emailValido;
  }

  emailEhValido(): boolean {
    return this.emailValido === true;
  }

  // Função para formatar telefone no formato (XX) XXXXX-XXXX
  formatarTelefoneString(telefone: string): string {
    const numeros = telefone.replace(/\D/g, "");
    if (numeros.length === 11) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(
        7,
        11
      )}`;
    }
    return telefone;
  }

  formatarTelefone(event: any) {
    let valor = event.target.value.replace(/\D/g, ""); // remove tudo que não for número

    // Formata como (XX) XXXXX-XXXX
    if (valor.length >= 2) {
      valor = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
    }
    if (valor.length >= 10) {
      valor = `${valor.slice(0, 10)}-${valor.slice(10, 14)}`;
    }

    this.usuario.telefone = valor;

    this.validarTelefone(); // chama a validação sempre que digitar
  }

  validarTelefone() {
    if (!this.usuario.telefone || this.usuario.telefone.trim() === "") {
      this.telefoneValido = null; // Não validar se estiver vazio
      return;
    }

    const apenasNumeros = this.usuario.telefone.replace(/\D/g, "");
    this.telefoneValido = apenasNumeros.length === 11;
  }

  telefoneEhOpcionalValido(): boolean {
    const telefone = this.usuario.telefone?.trim();
    if (!telefone) return true; // Se não preencheu o telefone, tudo certo
    return this.telefoneValido === true; // Se preencheu, tem que estar válido
  }

  verificarCpf(event: any) {
    const cpf = event.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    this.cpfDigitado = cpf;

    if (cpf.length === 11) {
      this.buscarUsuario();
    }
  }

  buscarUsuario() {
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.TOKEN}`,
    });

    const body = {
      CPFALUNO: this.cpfDigitado,
    };

    this.http
      .post(`${environment.apiUrl}/buscar-usuario`, body, { headers })
      .subscribe({
        next: (res: any) => {
          const usuario = res?.resposta.data?.usuario;
          if (usuario) {
            this.usuario = {
              id: usuario.ID,
              nome: usuario.NOME,
              cpf: usuario.CPF,
              codCurso: usuario.CODCURSO,
              RA: usuario.RA,
              email: usuario.EMAIL,
              telefone: usuario.TELEFONE,
              dtnascimento: usuario.DTNASCIMENTO,
            };
            this.validarTelefone();
            this.validarEmail(this.usuario.email); // atualiza status do email
          } else {
            this.usuario = {
              cpf: this.cpfDigitado,
              nome: "",
              telefone: "",
              email: "",
              curso: "",
              ra: "",
              dtnascimento: "",
              id: null,
            };
            this.telefoneValido = null;
            this.emailValido = null;
          }

          this.exibirFormulario = true;
        },
        error: (err) => {
          console.error("Erro ao buscar usuário por CPF:", err);
          this.usuario = {
            cpf: this.cpfDigitado,
            nome: "",
            telefone: "",
            email: "",
            curso: "",
            ra: "",
            dtnascimento: "",
            id: null,
          };
          this.exibirFormulario = true;
          this.telefoneValido = null;
          this.emailValido = null;
        },
      });
  }

  async guardar() {
    const IdFuncionario = this.usuarioService.getIdFuncionario();
    let IdLocal = this.usuarioService.getLocaisVinculados();

    //Se getLocaisVinculados retorna array, pega o primeiro ID:
    if (Array.isArray(IdLocal) && IdLocal.length > 0) {
      IdLocal = IdLocal[0].ID;
    }

    if (!this.emailEhValido()) return;

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${environment.TOKEN}`,
    });

    const body: any = {
      CPFALUNO: this.cpfDigitado,
      NOMEALUNO: this.usuario.nome,
      EMAILALUNO: this.usuario.email,
      DTNASCIMENTOALUNO: this.usuario.dtnascimento,
      IDFUNCIONARIO: IdFuncionario,
      IDLOCAL: IdLocal,
    };

    if (this.usuario.id) {
      body.IDALUNO = this.usuario.id;
    }

    this.http
      .post(`${environment.apiUrl}/vincular-aluno`, body, { headers })
      .subscribe({
        next: (res: any) => {
          const usuario = res?.resposta?.data?.usuario;
          if (usuario) {
            this.usuario = {
              id: usuario.ID,
              nome: usuario.NOME,
              cpf: usuario.CPF,
              codCurso: usuario.CODCURSO,
              RA: usuario.RA,
              email: usuario.EMAIL,
              telefone: usuario.TELEFONE,
              dtnascimento: usuario.DTNASCIMENTO,
            };
            this.validarTelefone();
            this.validarEmail(this.usuario.email);
            this.mostrarToast("Aluno vinculado com sucesso!", "success");
          } else {
            this.mostrarToast("Erro ao vincular aluno.", "danger");
          }
          this.exibirFormulario = true;
        },
        error: (err) => {
          console.error("Erro ao vincular aluno:", err);
          this.mostrarToast(
            "Erro ao vincular aluno. Tente novamente.",
            "danger"
          );
          this.exibirFormulario = true;
        },
      });
    this.abrirModal(this.usuario);
  }

  // APENAS PARA ABRIR A MODAL - FUNÇÃO DE CHAMADA
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

  // AQUI VALIDA PARA PREENCHER O MODAL
  buscarUsuarioPorCpf(cpf: string) {
    const body = { CPFALUNO: cpf };
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.TOKEN}`,
    });

    this.http
      .post(`${this.APIURL}/buscar-usuario`, body, { headers })
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

  async mostrarToast(mensagem: string, cor: string = "danger") {
    const toast = await this.toastController.create({
      message: mensagem,
      color: cor,
      duration: 2000,
      position: "bottom",
    });
    await toast.present();
  }
}
