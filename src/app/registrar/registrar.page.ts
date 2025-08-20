import { Component } from "@angular/core";
import { IonicModule, ToastController } from "@ionic/angular";
import { CommonModule } from "@angular/common";
import { RouterModule, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-registrar",
  templateUrl: "./registrar.page.html",
  styleUrls: ["./registrar.page.scss"],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
})
export class RegistrarPage {
  nome: string = "";
  cpfDigitado: string = "";
  telefone: string = "";
  email: string = "";
  dataNascimento: string = "";
  senha: string = "";
  confirmarSenha: string = "";
  erroSenha: boolean = false;
  camposInvalidos: boolean = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private http: HttpClient
  ) {}

  emailValido(): boolean {
    if (!this.email) return false;
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(this.email);
  }

  cpfValido(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  aplicarMascaraCPF(event: any) {
    let valor = event.detail.value.replace(/\D/g, "");
    if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
    if (valor.length > 6)
      valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (valor.length > 9)
      valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    this.cpfDigitado = valor;
  }

  aplicarMascaraTelefone(event: any) {
    let valor = event.detail.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "($1) $2");
    if (valor.length > 6) valor = valor.replace(/(\d{5})(\d)/, "$1-$2");
    this.telefone = valor;
  }

  aplicarMascaraData(event: any) {
    let valor = event.detail.value.replace(/\D/g, "");
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    if (valor.length > 4)
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    this.dataNascimento = valor;
  }

  // Nova função para validar se a data de nascimento não é maior que hoje
  dataNascimentoValida(dataStr: string): boolean {
    if (!dataStr) return false;
    // dataStr no formato dd/MM/yyyy
    const partes = dataStr.split("/");
    if (partes.length !== 3) return false;
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // mês 0-based no JS
    const ano = parseInt(partes[2], 10);

    const dataNascimento = new Date(ano, mes, dia);
    const hoje = new Date();

    // Zerar horas/minutos/segundos para comparação só da data
    dataNascimento.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    return dataNascimento <= hoje;
  }

  async salvar() {
    this.erroSenha = false;
    this.camposInvalidos = false;

    const cpfLimpo = this.cpfDigitado.replace(/\D/g, "");
    const telefoneLimpo = this.telefone.replace(/\D/g, "");
    const dataFormatada = this.dataNascimento;

    if (
      !this.nome ||
      !cpfLimpo ||
      !dataFormatada ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      this.camposInvalidos = true;
      this.mostrarToast("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!this.cpfValido(cpfLimpo)) {
      this.camposInvalidos = true;
      this.mostrarToast("CPF inválido.");
      return;
    }

    if (!this.emailValido()) {
      this.camposInvalidos = true;
      this.mostrarToast("E-mail inválido.");
      return;
    }

    if (telefoneLimpo && telefoneLimpo.length < 10) {
      this.mostrarToast("Telefone inválido.");
      return;
    }

    if (!this.dataNascimentoValida(dataFormatada)) {
      this.camposInvalidos = true;
      this.mostrarToast("Data de nascimento não pode ser maior que a data atual.");
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erroSenha = true;
      this.mostrarToast("As senhas não conferem.");
      return;
    }

    const url = `${environment.apiUrl}/cadastro`;
    const token = environment.TOKEN;

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const body = {
      NOME: this.nome,
      CPF: cpfLimpo,
      TELEFONE: telefoneLimpo,
      EMAIL: this.email,
      DTNASCIMENTO: dataFormatada,
      SENHA: this.senha,
      STATUS: 1,
      IDTIPOUSUARIO: 4,
    };

    try {
      await firstValueFrom(this.http.post(url, body, { headers }));
      this.mostrarToast("Cadastro realizado com sucesso!", "success");
      this.router.navigate(["tabs/aluno/home"]);
    } catch (error: any) {
      console.error(error);
      const msg = error?.error?.resposta?.toast?.mensagem;
      if (msg) {
        this.mostrarToast(msg);
      } else {
        this.mostrarToast("Erro ao cadastrar. Tente novamente.");
      }
    }
  }

  async mostrarToast(mensagem: string, cor: string = "danger") {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: cor,
      position: "top",
      cssClass: "toast-text-white",
    });
    toast.present();
  }
}
