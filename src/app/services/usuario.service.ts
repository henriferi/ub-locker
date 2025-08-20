import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class UsuarioService {
  constructor() {}

  getDadosUsuario(): object {
    const dadosUsuario = JSON.parse(
      localStorage.getItem("locker_usuario") || "{}"
    );
    return dadosUsuario || null;
  }

  getNomeFuncionario(): string {
    const usuario = JSON.parse(localStorage.getItem("locker_usuario") || "{}");
    return usuario?.NOME || "Funcionário";
  }

  getNomeAluno(): string {
    const usuario = JSON.parse(localStorage.getItem("locker_usuario") || "{}");
    return usuario?.NOME || "Aluno";
  }

  getCPFAluno(): string {
    const dadosUsuario = JSON.parse(
      localStorage.getItem("locker_usuario") || "{}"
    );
    return dadosUsuario.CPF || "CPF não encontrado";
  }

  setAlunoStorage(dados: any): void {
    localStorage.setItem("locker_usuario", JSON.stringify(dados));
  }

  getIdFuncionario(): any {
    const userData = JSON.parse(localStorage.getItem("locker_usuario") || "{}");
    return userData?.ID || null;
  }

  getLocaisVinculados(): object {
    const locaisVinculados = JSON.parse(
      localStorage.getItem("locais_vinculados") || "{}"
    );
    return locaisVinculados || null;
  }
}
