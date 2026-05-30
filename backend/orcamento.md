# Contrato da API: Cálculo de Orçamento

## Visão Geral

O cálculo do orçamento utiliza informações de duas fontes:

1. **Perfil Financeiro** (já cadastrado e associado ao usuário).
2. **Dados da Proposta** (informados a cada nova simulação de orçamento).

---

# Perfil Financeiro

> Estes dados são armazenados previamente e recuperados automaticamente pelo sistema.

| Campo                        | Tipo   | Valores                                                                     |
| ---------------------------- | ------ | --------------------------------------------------------------------------- |
| rendaMensalDesejada          | number | Valor desejado de renda mensal                                              |
| horasSemanaDisponiveis       | number | Horas disponíveis por semana                                                |
| custosMensaisTrabalho        | number | Custos mensais relacionados ao trabalho                                     |
| reservaFinanceiraRecomendada | number | Valor da reserva financeira desejada                                        |
| regimeTributario             | enum   | MEI (+2%), SIMPLES_NACIONAL (+5%), LUCRO_PRESUMIDO (+8%), LUCRO_REAL (+13%) |
| stackPrincipal               | enum   | FRONTEND (+20%), MOBILE (+25%), FULLSTACK (+30%), DEVOPS (+40%)             |
| cargaTrabalhoAtual           | enum   | NORMAL (0%), ALTA (+15%), SOBRECARREGADA (+30%)                             |
| nivelExperiencia             | enum   | JUNIOR, PLENO, SENIOR                                                       |

---

# Payload da Proposta

## Exemplo

```json
{
  "contextoProjeto": {
    "tipoProduto": "WEBAPP",
    "complexidadeProjeto": "MEDIA",
    "horasEstimadas": 120,
    "prazoEntregaSemanas": 8,
    "escopoDetalhadoDocumentado": true,
    "previsaoManutencaoMensalRecorrente": true,
    "reaproveitamentoComponentes": false,
    "frequenciaAlinhamentos": "SEMANAL",
    "dependenciasExternas": ["API de pagamentos"],
    "ferramentasBibliotecas": ["React", "Spring Boot"]
  },
  "perfilCliente": {
    "tipoCliente": "EMPRESA",
    "maturidade": "CONSCIENTE",
    "clienteRecorrente": false,
    "localizacaoGeografica": "NACIONAL",
    "geracaoReceita": "ALTO_IMPACTO"
  },
  "ajustesComerciais": {
    "formaCobranca": "PROJETO_FECHADO",
    "meioPagamento": "PIX",
    "parcelamento": "3X",
    "prazoRecebimento": "30_DIAS",
    "sinalEntrada": "20%",
    "contratoFormalPrestacao": true,
    "faturamentoRecorrenteAtivado": false
  }
}
```

---

# 1. Contexto do Projeto

| Campo                              | Tipo     | Valores                                        |
| ---------------------------------- | -------- | ---------------------------------------------- |
| tipoProduto                        | enum     | LANDING_PAGE, WEBSITE, WEBAPP, MOBILE_APP, API |
| complexidadeProjeto                | enum     | BAIXA, MEDIA, ALTA                             |
| horasEstimadas                     | number   | Horas previstas para execução                  |
| prazoEntregaSemanas                | number   | Prazo de entrega em semanas                    |
| escopoDetalhadoDocumentado         | boolean  | Escopo documentado                             |
| previsaoManutencaoMensalRecorrente | boolean  | Possui manutenção recorrente                   |
| reaproveitamentoComponentes        | boolean  | Reutilização significativa de componentes      |
| frequenciaAlinhamentos             | enum     | DIARIO (+20%), SEMANAL, QUINZENAL, MENSAL      |
| dependenciasExternas               | string[] | APIs, integrações ou terceiros envolvidos      |
| ferramentasBibliotecas             | string[] | Tecnologias previstas para o projeto           |

---

# 2. Perfil do Cliente

| Campo                 | Tipo    | Valores                                                               |
| --------------------- | ------- | --------------------------------------------------------------------- |
| tipoCliente           | enum    | PESSOA_FISICA, EMPRESA, STARTUP, AGENCIA, CORPORATIVO                 |
| maturidade            | enum    | LEIGO (+20%), CONSCIENTE, EXPERIENTE, MADURO                          |
| clienteRecorrente     | boolean | true (-10%), false (0%)                                               |
| localizacaoGeografica | enum    | LOCAL, REGIONAL, NACIONAL, INTERNACIONAL                              |
| geracaoReceita        | enum    | BAIXO_IMPACTO, MEDIO_IMPACTO, ALTO_IMPACTO (+25%), ESTRATEGICO (+25%) |

---

# 3. Ajustes Comerciais

| Campo                        | Tipo    | Valores                                                           |
| ---------------------------- | ------- | ----------------------------------------------------------------- |
| formaCobranca                | enum    | PROJETO_FECHADO, POR_HORA, ASSINATURA, POR_MARCOS                 |
| meioPagamento                | enum    | PIX (0%), BOLETO (0%), CARTAO_CREDITO (-4%), INTERNACIONAL (-10%) |
| parcelamento                 | enum    | AVISTA, 2X, 3X, 4X_OU_MAIS                                        |
| prazoRecebimento             | enum    | 7_DIAS, 15_DIAS, 30_DIAS, 45_DIAS (+5%), 60_DIAS (+5%)            |
| sinalEntrada                 | enum    | SEM_ENTRADA, 10%, 20%, 30%, 50%                                   |
| contratoFormalPrestacao      | boolean | Contrato formal assinado                                          |
| faturamentoRecorrenteAtivado | boolean | Possui cobrança recorrente                                        |

---

# Observações

- O Perfil Financeiro não é enviado no payload da proposta.
- O Perfil Financeiro é recuperado automaticamente a partir do usuário autenticado.
- Os percentuais descritos acima são utilizados como multiplicadores ou ajustes no cálculo final do orçamento.
- O sistema poderá aplicar regras adicionais de arredondamento, margem de segurança e valor mínimo conforme configuração interna.
