# Requisitos de Implementação e Arquitetura - ValorDev ⚙️

Este documento define as especificações técnicas, requisitos funcionais e não funcionais para os Casos de Uso existentes, e fornece uma especificação de arquitetura e exemplo de código prático para a implementação dos novos Casos de Uso propostos.

---

## 🛠️ Seção 1: Requisitos de Implementação (Casos de Uso Existentes)

### 1.1 Cadastro de Conta e Login (Autenticação)
* **Requisitos Funcionais (RF)**:
  * **RF01**: O sistema deve validar os campos de e-mail (formato válido) e senha (mínimo de 6 caracteres) na tela de cadastro utilizando **Zod**.
  * **RF02**: A senha digitada deve ser confirmada em um segundo campo ("Confirmar Senha"). Caso não coincidam, o sistema deve impedir o envio.
  * **RF03**: O login deve suportar persistência de sessão. Uma vez autenticado, o usuário deve ser redirecionado diretamente para a Home em acessos subsequentes.
  * **RF04**: O sistema deve tratar erros comuns (e-mail já cadastrado, senha incorreta, usuário inexistente) e exibir mensagens amigáveis em toasts ou modais.
* **Requisitos Não Funcionais (RNF)**:
  * **RNF01**: As credenciais do usuário devem ser validadas de forma assíncrona com feedback visual de carregamento (*ActivityIndicator*).
  * **RNF02**: O token de autenticação ou dados locais da sessão do usuário devem ser criptografados ou mantidos em armazenamento seguro local (*Expo SecureStore*).

### 1.2 Configuração de Perfil Financeiro
* **Requisitos Funcionais (RF)**:
  * **RF05**: O formulário deve aceitar entradas monetárias (gastos, receitas) em formato numérico formatado como moeda (Real brasileiro - BRL).
  * **RF06**: O sistema deve calcular o valor/hora ideal utilizando a fórmula:
    $$\text{Valor/Hora} = \frac{\text{Rendimento Desejado} + \text{Despesas de Trabalho} + \text{Gastos Pessoais}}{\text{Horas Produtivas Mensais}}$$
  * **RF07**: As horas produtivas mensais devem ser calculadas com base nas semanas úteis do ano, excluindo os dias de férias inseridos pelo usuário.
  * **RF08**: O valor calculado deve ser salvo de forma reativa no estado global do **Zustand** e persistido no armazenamento local (`AsyncStorage`).
* **Requisitos Não Funcionais (RNF)**:
  * **RNF03**: Mudanças nas entradas numéricas devem recalcular o valor/hora em tempo real na interface (cálculo em *tempo de digitação*).
  * **RNF04**: Teclados abertos em dispositivos móveis para estes campos devem ser do tipo numérico (`keyboardType="numeric"`).

### 1.3 Cálculo de Proposta (Wizard de Precificação)
* **Requisitos Funcionais (RF)**:
  * **RF09**: O Wizard deve persistir os dados temporários de cada etapa no estado global para que o usuário possa voltar passos sem perder dados.
  * **RF10**: O passo de **Análise de Risco** deve computar um multiplicador de risco (de 1.0 a 1.5) dependendo das respostas de complexidade e maturidade do cliente.
  * **RF11**: A precificação final deve aplicar a fórmula:
    $$\text{Preço Final} = \frac{(\text{Horas Estimadas} \times \text{Valor/Hora}) \times \text{Multiplicador de Risco} + \text{Gordura Extra}}{1 - \text{Alíquota de Impostos}}$$
  * **RF12**: A tela final (Passo 5) deve exibir um detalhamento claro de custos operacionais, impostos pagos, margem de lucro e preço final sugerido.
* **Requisitos Não Funcionais (RNF)**:
  * **RNF05**: A transição entre os passos do Wizard deve conter micro-animações (ex: *slide* lateral) usando `react-native-reanimated` ou transições nativas do *Expo Router*.

### 1.4 Histórico de Estimativas
* **Requisitos Funcionais (RF)**:
  * **RF13**: O histórico deve ordenar as propostas de forma decrescente (da mais recente para a mais antiga).
  * **RF14**: O usuário deve poder excluir uma proposta do histórico, o que deve disparar um aviso de confirmação.
  * **RF15**: Ao clicar em um item do histórico, o aplicativo deve abrir a tela de detalhamento daquela estimativa correspondente.
* **Requisitos Não Funcionais (RNF)**:
  * **RNF06**: A listagem de propostas no histórico deve utilizar componentes performáticos como `FlatList` para otimização de renderização.

---

## 💻 Seção 2: Exemplo de Implementação para os Novos Casos de Uso

Para ilustrar a arquitetura recomendada para a implementação das novas sugestões, desenvolvemos abaixo um exemplo de implementação para o **UC7: Registro de Horas Reais (Time Tracker)** e cálculo de **Desvio de Estimativa**.

Utilizaremos uma arquitetura moderna baseada em **React Native**, **TypeScript**, **Zustand** para o gerenciamento de estado e **Lucide Icons** para a UI.

### 2.1 Schema de Dados (`types/tracker.types.ts`)
Define as tipagens necessárias para suportar a medição de tempo e a comparação com as estimativas.

```typescript
export interface TaskTimeLog {
  id: string;
  projectId: string;
  projectName: string;
  taskName: string;
  estimatedHours: number;
  actualHours: number; // Armazenado em formato decimal (ex: 2.5 horas = 2h 30m)
  elapsedSeconds: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  startTime?: number; // Timestamp do último "play"
}

export interface ProjectDeviationSummary {
  projectId: string;
  projectName: string;
  totalEstimatedHours: number;
  totalActualHours: number;
  deviationPercent: number; // ((Real - Estimado) / Estimado) * 100
}
```

### 2.2 Gerenciador de Estado - Zustand (`store/trackerStore.ts`)
Implementa as ações de iniciar, pausar, finalizar e calcular a discrepância de horas com persistência local automática.

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskTimeLog } from '../types/tracker.types';

interface TrackerState {
  tasks: TaskTimeLog[];
  activeTaskId: string | null;
  addTaskLog: (projectId: string, projectName: string, taskName: string, estimatedHours: number) => void;
  startTimer: (taskId: string) => void;
  pauseTimer: (taskId: string) => void;
  stopTimer: (taskId: string) => void;
  updateSeconds: (taskId: string, elapsed: number) => void;
}

export const useTrackerStore = create<TrackerState>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeTaskId: null,

      addTaskLog: (projectId, projectName, taskName, estimatedHours) => set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: Math.random().toString(36).substring(7),
            projectId,
            projectName,
            taskName,
            estimatedHours,
            actualHours: 0,
            elapsedSeconds: 0,
            status: 'idle'
          }
        ]
      })),

      startTimer: (taskId) => set((state) => {
        // Pausa qualquer timer que esteja rodando antes
        const updatedTasks = state.tasks.map(t => {
          if (t.status === 'running') {
            const timePassed = Math.floor((Date.now() - (t.startTime || Date.now())) / 1000);
            return {
              ...t,
              status: 'paused' as const,
              elapsedSeconds: t.elapsedSeconds + timePassed
            };
          }
          if (t.id === taskId) {
            return { ...t, status: 'running' as const, startTime: Date.now() };
          }
          return t;
        });

        return {
          tasks: updatedTasks,
          activeTaskId: taskId
        };
      }),

      pauseTimer: (taskId) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId && t.status === 'running') {
            const timePassed = Math.floor((Date.now() - (t.startTime || Date.now())) / 1000);
            return {
              ...t,
              status: 'paused' as const,
              elapsedSeconds: t.elapsedSeconds + timePassed,
              startTime: undefined
            };
          }
          return t;
        });
        return { tasks: updatedTasks, activeTaskId: null };
      }),

      stopTimer: (taskId) => set((state) => {
        const updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            let finalSeconds = t.elapsedSeconds;
            if (t.status === 'running' && t.startTime) {
              finalSeconds += Math.floor((Date.now() - t.startTime) / 1000);
            }
            const hoursDecimal = parseFloat((finalSeconds / 3600).toFixed(2));
            return {
              ...t,
              status: 'completed' as const,
              elapsedSeconds: finalSeconds,
              actualHours: hoursDecimal,
              startTime: undefined
            };
          }
          return t;
        });
        return { tasks: updatedTasks, activeTaskId: null };
      }),

      updateSeconds: (taskId, elapsed) => set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? { ...t, elapsedSeconds: elapsed } : t)
      }))
    }),
    {
      name: 'valordev-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
```

### 2.3 Componente Visual de Interface (`components/TimeTracker.tsx`)
Interface premium desenvolvida utilizando React Native, Tailwind (NativeWind) e ícones vetorizados, fornecendo feedback de tempo rodando e alerta visual de desvios.

```tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, Square, AlertCircle, CheckCircle } from 'lucide-react-native';
import { useTrackerStore } from '../store/trackerStore';
import { TaskTimeLog } from '../types/tracker.types';

interface Props {
  task: TaskTimeLog;
}

export function TimeTracker({ task }: Props) {
  const { startTimer, pauseTimer, stopTimer } = useTrackerStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Efeito para atualizar visualmente o tempo decorrido a cada segundo se estiver rodando
  useEffect(() => {
    if (task.status === 'running') {
      timerRef.current = setInterval(() => {
        // Incremento visual do timer local se necessário ou recarga de estado
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [task.status]);

  // Formatação de segundos para formato HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Cálculo da discrepância em tempo real
  const currentHours = parseFloat((task.elapsedSeconds / 3600).toFixed(2));
  const deviation = currentHours - task.estimatedHours;
  const isOverEstimated = deviation > 0;

  return (
    <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-4 shadow-lg">
      <View className="flex-row justify-between items-center mb-3">
        <View>
          <Text className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{task.projectName}</Text>
          <Text className="text-white text-lg font-bold mt-0.5">{task.taskName}</Text>
        </View>
        <View className="bg-slate-800 px-3 py-1.5 rounded-full">
          <Text className="text-cyan-400 text-xs font-semibold">
            Estimado: {task.estimatedHours}h
          </Text>
        </View>
      </View>

      {/* Timer Display */}
      <View className="bg-slate-950 py-4 rounded-xl items-center my-2 border border-slate-900">
        <Text className="text-slate-500 text-xs font-medium uppercase tracking-widest">Tempo Decorrido</Text>
        <Text className="text-white text-3xl font-extrabold tracking-widest mt-1">
          {formatTime(task.elapsedSeconds)}
        </Text>
      </View>

      {/* Alerta de Desvio de Escopo */}
      {deviation !== 0 && (
        <View className={`flex-row items-center p-3 rounded-lg mt-2 mb-4 border ${
          isOverEstimated ? 'bg-red-950/40 border-red-900/60' : 'bg-green-950/40 border-green-900/60'
        }`}>
          {isOverEstimated ? (
            <>
              <AlertCircle size={18} color="#ef4444" />
              <Text className="text-red-400 text-xs font-medium ml-2 flex-1">
                Atenção: Você estourou o escopo estimado em {deviation.toFixed(1)}h!
              </Text>
            </>
          ) : (
            <>
              <CheckCircle size={18} color="#22c55e" />
              <Text className="text-green-400 text-xs font-medium ml-2 flex-1">
                Dentro do planejado. Restam {(Math.abs(deviation)).toFixed(1)}h estimadas.
              </Text>
            </>
          )}
        </View>
      )}

      {/* Controles do Timer */}
      <View className="flex-row justify-around mt-2">
        {task.status !== 'running' ? (
          <TouchableOpacity
            onPress={() => startTimer(task.id)}
            className="flex-row items-center bg-cyan-500 px-6 py-3 rounded-full shadow-md"
            activeOpacity={0.7}
          >
            <Play size={16} color="#0f172a" fill="#0f172a" />
            <Text className="text-slate-950 font-bold ml-2">Iniciar Trabalho</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => pauseTimer(task.id)}
            className="flex-row items-center bg-yellow-500 px-6 py-3 rounded-full shadow-md"
            activeOpacity={0.7}
          >
            <Pause size={16} color="#0f172a" fill="#0f172a" />
            <Text className="text-slate-950 font-bold ml-2">Pausar Timer</Text>
          </TouchableOpacity>
        )}

        {task.status !== 'idle' && task.status !== 'completed' && (
          <TouchableOpacity
            onPress={() => stopTimer(task.id)}
            className="flex-row items-center bg-red-600 px-6 py-3 rounded-full shadow-md"
            activeOpacity={0.7}
          >
            <Square size={14} color="#ffffff" fill="#ffffff" />
            <Text className="text-white font-bold ml-2">Finalizar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
```
