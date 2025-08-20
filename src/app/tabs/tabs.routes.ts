import { Routes } from "@angular/router";
import { TabsPage } from "./tabs.page";
import { funcionarioGuard } from "../guards/funcionario.guard";
import { alunoGuard } from "../guards/aluno.guard";

export const ROUTES: Routes = [
  {
    path: "",
    component: TabsPage,
    children: [
      // Rotas protegidas para FUNCIONÁRIO
      {
        path: "funcionario",
        canActivate: [funcionarioGuard],
        children: [
          {
            path: "home",
            loadComponent: () =>
              import("../funcionario/home/home.page").then((m) => m.HomePage),
          },
          {
            path: "lockers",
            loadComponent: () =>
              import("../funcionario/lockers/lockers.page").then(
                (m) => m.LockersPage
              ),
          },
          {
            path: "qrcode",
            loadComponent: () =>
              import("../funcionario/qrcode/qrcode.page").then(
                (m) => m.QrcodePage
              ),
          },
          {
            path: "cadastro",
            loadComponent: () =>
              import("../funcionario/cadastro/cadastro.page").then(
                (m) => m.CadastroPage
              ),
          },
          {
            path: "perfil",
            loadComponent: () =>
              import("../funcionario/perfil/perfil.page").then(
                (m) => m.PerfilPage
              ),
          },
          {
            path: "sobre",
            loadComponent: () =>
              import("../funcionario/sobre/sobre.page").then(
                (m) => m.SobrePage
              ),
          },
          {
            path: "desvincular",
            loadComponent: () =>
              import("../funcionario/desvincular/desvincular.page").then(
                (m) => m.DesvincularPage
              ),
          },
          {
            path: "",
            redirectTo: "home",
            pathMatch: "full",
          },
        ],
      },

      // Rotas protegidas para ALUNO
      {
        path: "aluno",
        canActivate: [alunoGuard],
        children: [
          {
            path: "home",
            loadComponent: () =>
              import("../aluno/home/home.page").then((m) => m.HomePage),
          },
          {
            path: "perfil",
            loadComponent: () =>
              import("../aluno/perfil/perfil.page").then((m) => m.PerfilPage),
          },
          {
            path: "historico",
            loadComponent: () =>
              import("../aluno/historico/historico.page").then(
                (m) => m.HistoricoPage
              ),
          },
          {
            path: "",
            redirectTo: "home",
            pathMatch: "full",
          },
        ],
      },

      // Redirecionamento padrão
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
    ],
  },
];
