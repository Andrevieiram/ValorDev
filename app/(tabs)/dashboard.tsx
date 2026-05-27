import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, Dimensions, Pressable } from "react-native";
import { TrendingUp, Target, Briefcase, Activity, CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, MotionFadeUp, Modal } from "@/components/ui";
import { useHistoryStore, useWizardStore } from "@/store";
import { formatCurrency } from "@/utils";
import { Probability } from "@/types";

export default function DashboardScreen() {
    const { items } = useHistoryStore();
    const { profile } = useWizardStore();
    const [selectedProbability, setSelectedProbability] = useState<Probability | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Extrair meta mensal. Se estiver vazio, assume 0.
    const monthlyGoal = useMemo(() => {
        const incomeStr = profile?.desiredIncome?.replace(/\D/g, "") || "";
        const num = parseFloat(incomeStr) / 100;
        return (isNaN(num) || num === 0) ? 40000 : num; // Fallback mock 40k
    }, [profile?.desiredIncome]);

    // Calcular pipeline (funil de vendas)
    const pipeline = useMemo(() => {
        const result = {
            fechada: { count: 0, value: 0, color: '#22c55e', bg: 'rgba(34,197,94,0.15)', label: 'Negócios Fechados' },
            alta: { count: 0, value: 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', label: 'Alta Probabilidade' },
            media: { count: 0, value: 0, color: '#eab308', bg: 'rgba(234,179,8,0.15)', label: 'Média Probabilidade' },
            baixa: { count: 0, value: 0, color: '#f97316', bg: 'rgba(249,115,22,0.15)', label: 'Baixa Probabilidade' },
            perdida: { count: 0, value: 0, color: '#ef4444', bg: 'rgba(239,68,68,0.15)', label: 'Negócios Perdidos' },
        };

        let totalPotential = 0;

        items.forEach(item => {
            let prob = item.probability || 'media';
            if (item.status === 'won') prob = 'fechada';
            if (item.status === 'lost') prob = 'perdida';

            result[prob].count += 1;
            result[prob].value += item.value;

            if (prob !== 'perdida') {
                totalPotential += item.value;
            }
        });

        return { breakdown: result, totalPotential };
    }, [items]);

    // Progresso da Meta
    const goalProgress = useMemo(() => {
        if (monthlyGoal === 0) return 0;
        // Calculamos o progresso apenas com negócios "Fechados"
        const progress = (pipeline.breakdown.fechada.value / monthlyGoal) * 100;
        return Math.min(progress, 100);
    }, [monthlyGoal, pipeline.breakdown.fechada.value]);

    // Progresso Otimista (Fechado + Alta)
    const optimisticProgress = useMemo(() => {
        if (monthlyGoal === 0) return 0;
        const totalOptimistic = pipeline.breakdown.fechada.value + pipeline.breakdown.alta.value;
        const progress = (totalOptimistic / monthlyGoal) * 100;
        return Math.min(progress, 100);
    }, [monthlyGoal, pipeline.breakdown.fechada.value, pipeline.breakdown.alta.value]);

    const isGoalReached = goalProgress >= 100;

    const openModal = (prob: Probability | 'fechada' | 'perdida') => {
        setSelectedProbability(prob);
        setModalVisible(true);
    };

    const selectedItems = useMemo(() => {
        if (!selectedProbability) return [];
        return items.filter(i => {
            let prob = i.probability || 'media';
            if (i.status === 'won') prob = 'fechada';
            if (i.status === 'lost') prob = 'perdida';
            
            return prob === selectedProbability;
        });
    }, [items, selectedProbability]);

    const getModalTitle = () => {
        if (!selectedProbability) return '';
        // @ts-ignore (Ignorando pois as chaves batem com o breakdown)
        return pipeline.breakdown[selectedProbability]?.label || 'Projetos';
    };

    return (
        <ScreenContainer maxWidth="container" scrollable>
            <View className="gap-6 pb-24">
                {/* Header */}
                <MotionFadeUp delay={100} className="gap-1">
                    <Text className="text-2xl text-foreground dark:text-white" style={{ fontFamily: 'Inter_700Bold' }}>
                        Dashboard Financeiro
                    </Text>
                    <Text className="text-sm text-muted-foreground dark:text-slate-300" style={{ fontFamily: 'Inter_400Regular' }}>
                        Acompanhe seu funil de negócios e sua meta mensal.
                    </Text>
                </MotionFadeUp>

                {/* Meta Mensal Card */}
                <MotionFadeUp delay={150}>
                    <Card variant="glass" className="gap-4 border-primary/20">
                        <View className="flex-row justify-between items-start">
                            <View className="gap-1">
                                <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                    Meta Mensal
                                </Text>
                                <Text className="text-3xl text-primary" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {formatCurrency(monthlyGoal)}
                                </Text>
                            </View>
                            <View className="p-3 bg-primary/10 rounded-full">
                                <Target size={24} color="#38bdf8" />
                            </View>
                        </View>

                        {/* Barras de Progresso */}
                        <View className="gap-2 mt-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-sm text-foreground dark:text-slate-200" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                    Progresso Atual
                                </Text>
                                <Text className="text-sm text-primary dark:text-blue-400" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {goalProgress.toFixed(1)}%
                                </Text>
                            </View>

                            {/* Stacked Progress Bar */}
                            <View className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex-row relative">
                                {/* Otimista (Alta prob) fica por baixo */}
                                <View 
                                    className="absolute left-0 top-0 bottom-0 bg-blue-400" 
                                    style={{ width: `${optimisticProgress}%`, opacity: 0.5 }} 
                                />
                                {/* Fechado (Garantido) fica por cima e se destaca */}
                                <View 
                                    className="absolute left-0 top-0 bottom-0 bg-green-500 rounded-r-full" 
                                    style={{ width: `${goalProgress}%`, zIndex: 10 }} 
                                />
                            </View>

                            <View className="flex-row justify-between mt-1">
                                <View className="flex-row items-center gap-1.5">
                                    <View className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    <Text className="text-xs text-muted-foreground dark:text-slate-300">Garantido</Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <View className="w-2.5 h-2.5 rounded-full bg-blue-400 opacity-80" />
                                    <Text className="text-xs text-muted-foreground dark:text-slate-300">Otimista (+ Alta Prob.)</Text>
                                </View>
                            </View>
                        </View>

                        {isGoalReached && (
                            <View className="flex-row items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/30">
                                <CheckCircle size={18} color="#22c55e" />
                                <Text className="text-sm text-green-700 dark:text-green-400" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                    Parabéns! Você bateu sua meta do mês.
                                </Text>
                            </View>
                        )}
                        
                        {!isGoalReached && goalProgress > 0 && optimisticProgress >= 100 && (
                            <View className="flex-row items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/30">
                                <TrendingUp size={18} color="#3b82f6" />
                                <Text className="text-sm text-blue-700 dark:text-blue-400" style={{ fontFamily: 'Inter_600SemiBold', flex: 1 }}>
                                    Se fechar os projetos de Alta Probabilidade, você bate a meta!
                                </Text>
                            </View>
                        )}
                    </Card>
                </MotionFadeUp>

                {/* Gráfico de Barras Comparativo (Horizontal) */}
                <MotionFadeUp delay={180}>
                    <Card variant="glass" className="gap-5 mt-2 border-slate-200 dark:border-slate-800">
                        <View className="flex-row items-center gap-2 mb-1">
                            <Activity size={20} color="#94a3b8" />
                            <Text className="text-base text-foreground dark:text-white" style={{ fontFamily: 'Inter_700Bold' }}>
                                Projeção de Faturamento
                            </Text>
                        </View>
                        
                        <View className="gap-5">
                            {/* Barra 1: Meta */}
                            <View className="gap-2">
                                <View className="flex-row justify-between items-end">
                                    <Text className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">
                                        Meta Mensal
                                    </Text>
                                    <Text className="text-sm font-bold text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                        {formatCurrency(monthlyGoal)}
                                    </Text>
                                </View>
                                <View className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <View className="h-full bg-primary/40 rounded-full" style={{ width: '100%' }} />
                                </View>
                            </View>

                            {/* Barra 2: Otimista */}
                            <View className="gap-2">
                                <View className="flex-row justify-between items-end">
                                    <View className="flex-row items-center gap-1.5">
                                        <View className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        <Text className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">
                                            Cenário Otimista
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-sm font-bold text-blue-500" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                            {formatCurrency(pipeline.breakdown.fechada.value + pipeline.breakdown.alta.value)}
                                        </Text>
                                        <Text className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                            ({optimisticProgress.toFixed(1)}% da Meta)
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <View className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(optimisticProgress, 100)}%` }} />
                                </View>
                            </View>

                            {/* Barra 3: Garantido */}
                            <View className="gap-2">
                                <View className="flex-row justify-between items-end">
                                    <View className="flex-row items-center gap-1.5">
                                        <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <Text className="text-xs font-semibold text-muted-foreground dark:text-slate-400 uppercase tracking-widest">
                                            Garantido (Fechado)
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-sm font-bold text-green-500" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                            {formatCurrency(pipeline.breakdown.fechada.value)}
                                        </Text>
                                        <Text className="text-[10px] text-muted-foreground font-medium mt-0.5">
                                            ({goalProgress.toFixed(1)}% da Meta)
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <View className="h-full bg-green-500 rounded-full" style={{ width: `${Math.min(goalProgress, 100)}%` }} />
                                </View>
                            </View>
                        </View>
                    </Card>
                </MotionFadeUp>

                {/* Funil de Vendas */}
                <MotionFadeUp delay={200} className="gap-4 mt-2">
                    <Text className="text-lg text-foreground dark:text-white px-1" style={{ fontFamily: 'Inter_700Bold' }}>
                        Funil de Projetos
                    </Text>

                    <View className="gap-3">
                        {/* Negócios Fechados */}
                        <Card variant="glass" className="flex-row items-center gap-4" onPress={() => openModal('fechada')}>
                            <View className="p-3 rounded-full" style={{ backgroundColor: pipeline.breakdown.fechada.bg }}>
                                <Briefcase size={22} color={pipeline.breakdown.fechada.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm text-muted-foreground dark:text-slate-300" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                    {pipeline.breakdown.fechada.label} ({pipeline.breakdown.fechada.count})
                                </Text>
                                <Text className="text-xl text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {formatCurrency(pipeline.breakdown.fechada.value)}
                                </Text>
                            </View>
                        </Card>

                        {/* Alta Probabilidade */}
                        <Card variant="glass" className="flex-row items-center gap-4 border-blue-500/20" onPress={() => openModal('alta')}>
                            <View className="p-3 rounded-full" style={{ backgroundColor: pipeline.breakdown.alta.bg }}>
                                <Activity size={22} color={pipeline.breakdown.alta.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm text-muted-foreground dark:text-slate-300" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                    {pipeline.breakdown.alta.label} ({pipeline.breakdown.alta.count})
                                </Text>
                                <Text className="text-xl text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {formatCurrency(pipeline.breakdown.alta.value)}
                                </Text>
                            </View>
                        </Card>

                        <View className="flex-row gap-3">
                            {/* Média Probabilidade */}
                            <Card variant="glass" className="flex-1 p-4 gap-2" onPress={() => openModal('media')}>
                                <View className="flex-row items-center justify-between">
                                    <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: pipeline.breakdown.media.bg }}>
                                        <Clock size={16} color={pipeline.breakdown.media.color} />
                                    </View>
                                    <Text className="text-sm text-foreground dark:text-white font-bold">{pipeline.breakdown.media.count}</Text>
                                </View>
                                <Text className="text-xs text-muted-foreground dark:text-slate-300 mt-1" style={{ fontFamily: 'Inter_500Medium' }}>
                                    Média Prob.
                                </Text>
                                <Text className="text-sm text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {formatCurrency(pipeline.breakdown.media.value)}
                                </Text>
                            </Card>

                            {/* Baixa Probabilidade */}
                            <Card variant="glass" className="flex-1 p-4 gap-2" onPress={() => openModal('baixa')}>
                                <View className="flex-row items-center justify-between">
                                    <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: pipeline.breakdown.baixa.bg }}>
                                        <AlertCircle size={16} color={pipeline.breakdown.baixa.color} />
                                    </View>
                                    <Text className="text-sm text-foreground dark:text-white font-bold">{pipeline.breakdown.baixa.count}</Text>
                                </View>
                                <Text className="text-xs text-muted-foreground dark:text-slate-300 mt-1" style={{ fontFamily: 'Inter_500Medium' }}>
                                    Baixa Prob.
                                </Text>
                                <Text className="text-sm text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                    {formatCurrency(pipeline.breakdown.baixa.value)}
                                </Text>
                            </Card>
                        </View>
                    </View>
                </MotionFadeUp>
            </View>

            {/* Modal de Projetos */}
            <Modal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title={getModalTitle()}
            >
                <ScrollView className="max-h-[300px] mt-2">
                    {selectedItems.length === 0 ? (
                        <Text className="text-center text-muted-foreground dark:text-slate-400 py-4">
                            Nenhum projeto encontrado.
                        </Text>
                    ) : (
                        <View className="gap-2">
                            {selectedItems.map((item) => (
                                <View key={item.id} className="flex-row justify-between items-center p-3 bg-slate-100 dark:bg-slate-800/80 rounded-lg">
                                    <View className="flex-1">
                                        <Text className="font-medium text-foreground dark:text-white" numberOfLines={1}>
                                            {item.name}
                                        </Text>
                                        <Text className="text-xs text-muted-foreground dark:text-slate-400 mt-1">
                                            Proposta {item.id}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-bold text-foreground dark:text-white ml-2" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                        {formatCurrency(item.value)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </Modal>
        </ScreenContainer>
    );
}
