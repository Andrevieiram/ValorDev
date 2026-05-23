import React, { useState, useMemo } from "react";
import { FlatList, Text, View, Pressable, TextInput, Alert } from "react-native";
import { Trash2, Search, Calendar, Sliders, ChevronDown } from "lucide-react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, MotionFadeUp, SegmentedControl, Modal, Button } from "@/components/ui";
import { useHistoryStore } from "@/store";
import { formatCurrency } from "@/utils";
import { Probability } from "@/types";

const PROBABILITY_COLORS: Record<Probability, { bg: string; text: string; label: string }> = {
    fechada: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', label: 'Fechada' },
    alta: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6', label: 'Alta Prob.' },
    media: { bg: 'rgba(234,179,8,0.15)', text: '#eab308', label: 'Média Prob.' },
    baixa: { bg: 'rgba(249,115,22,0.15)', text: '#f97316', label: 'Baixa Prob.' },
    perdida: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', label: 'Perdida' },
};

const PROBABILITY_WEIGHTS: Record<Probability, number> = {
    fechada: 5,
    alta: 4,
    media: 3,
    baixa: 2,
    perdida: 1,
};

export default function HistoryScreen() {
    const { items, removeItem, updateItemProbability } = useHistoryStore();
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "probability">("date");
    
    // Modal State
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const filteredAndSortedItems = useMemo(() => {
        let result = [...items];

        if (search.trim()) {
            result = result.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sortBy === "probability") {
            result.sort((a, b) => {
                const wA = PROBABILITY_WEIGHTS[a.probability || 'media'];
                const wB = PROBABILITY_WEIGHTS[b.probability || 'media'];
                if (wA !== wB) return wB - wA; // Maior probabilidade primeiro
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        } else {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return result;
    }, [items, search, sortBy]);

    const totals = useMemo(() => {
        const count = filteredAndSortedItems.length;
        const totalValue = filteredAndSortedItems.reduce((acc, item) => acc + item.value, 0);
        return { count, totalValue };
    }, [filteredAndSortedItems]);

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Excluir cálculo",
            `Deseja realmente remover o cálculo do projeto "${name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => await removeItem(id),
                },
            ]
        );
    };

    const handleUpdateProbability = async (prob: Probability) => {
        if (selectedItemId) {
            await updateItemProbability(selectedItemId, prob);
            setSelectedItemId(null);
        }
    };

    return (
        <ScreenContainer maxWidth="container" scrollable={false}>
            <View className="flex-1 pb-24">
                {filteredAndSortedItems.length === 0 ? (
                    <View className="flex-1">
                        <View className="gap-6 mb-6">
                            {/* Header */}
                            <View className="gap-1">
                                <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                                    Histórico de Precificações
                                </Text>
                                <Text className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter_400Regular' }}>
                                    Acompanhe, busque e gerencie suas propostas salvas.
                                </Text>
                            </View>

                            {/* Dashboard Metrics Card */}
                            <Card variant="glass" className="flex-row justify-between items-center">
                                <View className="gap-1">
                                    <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                        Total Estimado
                                    </Text>
                                    <Text className="text-2xl text-primary" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                        {formatCurrency(totals.totalValue)}
                                    </Text>
                                </View>
                                <View className="gap-1 items-end">
                                    <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                        Calculados
                                    </Text>
                                    <Text className="text-2xl text-foreground" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                        {totals.count} {totals.count === 1 ? "item" : "itens"}
                                    </Text>
                                </View>
                            </Card>

                            {/* Ordenação e Busca */}
                            <View className="gap-3">
                                <SegmentedControl
                                    options={[
                                        { label: "Mais Recentes", value: "date" },
                                        { label: "Maior Probabilidade", value: "probability" },
                                    ]}
                                    value={sortBy}
                                    onChange={(v) => setSortBy(v as any)}
                                />

                                <View className="flex-row items-center border border-border dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-900/20 px-4 py-3 gap-3">
                                    <Search size={18} color="#94a3b8" />
                                    <TextInput
                                        placeholder="Buscar por tipo de projeto..."
                                        placeholderTextColor="#94a3b8"
                                        value={search}
                                        onChangeText={setSearch}
                                        className="flex-1 text-sm text-foreground dark:text-white"
                                        style={{ outlineStyle: 'none' } as any}
                                    />
                                    {search.length > 0 && (
                                        <Pressable onPress={() => setSearch("")} hitSlop={8}>
                                            <Text className="text-xs text-primary font-medium">Limpar</Text>
                                        </Pressable>
                                    )}
                                </View>
                            </View>
                        </View>
                        
                        <MotionFadeUp delay={300} className="py-12 items-center justify-center gap-3">
                            <Sliders size={32} color="#94a3b8" />
                            <Text className="text-base text-muted-foreground text-center font-medium">
                                {search.length > 0 ? "Nenhum cálculo corresponde à busca." : "Nenhum cálculo salvo ainda."}
                            </Text>
                        </MotionFadeUp>
                    </View>
                ) : (
                    <FlatList
                        data={filteredAndSortedItems}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                            <View className="gap-6 mb-6">
                                {/* Header */}
                                <View className="gap-1">
                                    <Text className="text-2xl text-foreground dark:text-white" style={{ fontFamily: 'Inter_700Bold' }}>
                                        Histórico de Precificações
                                    </Text>
                                    <Text className="text-sm text-muted-foreground dark:text-slate-300" style={{ fontFamily: 'Inter_400Regular' }}>
                                        Acompanhe, busque e gerencie suas propostas salvas.
                                    </Text>
                                </View>

                                {/* Dashboard Metrics Card */}
                                <Card variant="glass" className="flex-row justify-between items-center">
                                    <View className="gap-1">
                                        <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                            Total Estimado
                                        </Text>
                                        <Text className="text-2xl text-primary" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                            {formatCurrency(totals.totalValue)}
                                        </Text>
                                    </View>
                                    <View className="gap-1 items-end">
                                        <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                                            Calculados
                                        </Text>
                                        <Text className="text-2xl text-foreground dark:text-white" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                            {totals.count} {totals.count === 1 ? "item" : "itens"}
                                        </Text>
                                    </View>
                                </Card>

                                {/* Ordenação e Busca */}
                                <View className="gap-3">
                                    <SegmentedControl
                                        options={[
                                            { label: "Mais Recentes", value: "date" },
                                            { label: "Maior Probabilidade", value: "probability" },
                                        ]}
                                        value={sortBy}
                                        onChange={(v) => setSortBy(v as any)}
                                    />

                                    <View className="flex-row items-center border border-border dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-900/20 px-4 py-3 gap-3">
                                        <Search size={18} color="#94a3b8" />
                                        <TextInput
                                            placeholder="Buscar por tipo de projeto..."
                                            placeholderTextColor="#94a3b8"
                                            value={search}
                                            onChangeText={setSearch}
                                            className="flex-1 text-sm text-foreground dark:text-white"
                                            style={{ outlineStyle: 'none' } as any}
                                        />
                                        {search.length > 0 && (
                                            <Pressable onPress={() => setSearch("")} hitSlop={8}>
                                                <Text className="text-xs text-primary font-medium">Limpar</Text>
                                            </Pressable>
                                        )}
                                    </View>
                                </View>
                            </View>
                        }
                        data={filteredAndSortedItems}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}

                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        renderItem={({ item, index }) => {
                            const prob = item.probability || 'media';
                            const badge = PROBABILITY_COLORS[prob];
                            
                            return (
                                <MotionFadeUp delay={150 + index * 80}>
                                    <Card variant="glass" className="gap-3">
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1 gap-1 pr-3">
                                                <Text className="text-base text-foreground dark:text-white" style={{ fontFamily: 'Inter_700Bold' }}>
                                                    {item.name}
                                                </Text>
                                                <View className="flex-row items-center gap-1.5">
                                                    <Calendar size={12} color="#94a3b8" />
                                                    <Text className="text-xs text-muted-foreground dark:text-slate-300">
                                                        {item.date || new Date(item.createdAt).toLocaleDateString("pt-BR")}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Pressable
                                                onPress={() => handleDelete(item.id, item.name)}
                                                className="p-2 rounded-full active:scale-95 bg-red-50 dark:bg-red-900/20"
                                                hitSlop={8}
                                            >
                                                <Trash2 size={16} color="#ef4444" />
                                            </Pressable>
                                        </View>

                                        <View className="flex-row justify-between items-end mt-1">
                                            <Text className="text-lg text-primary" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                                {formatCurrency(item.value)}
                                            </Text>

                                            <Pressable 
                                                onPress={() => setSelectedItemId(item.id)}
                                                className="flex-row items-center gap-1 px-2.5 py-1 rounded-full border border-transparent active:opacity-70"
                                                style={{ backgroundColor: badge.bg, borderColor: badge.text + '30' }}
                                            >
                                                <Text style={{ color: badge.text, fontFamily: 'Inter_600SemiBold', fontSize: 11 }}>
                                                    {badge.label}
                                                </Text>
                                                <ChevronDown size={12} color={badge.text} />
                                            </Pressable>
                                        </View>
                                    </Card>
                                </MotionFadeUp>
                            );
                        }}
                    />
                )}
            </View>

            <Modal
                visible={!!selectedItemId}
                onClose={() => setSelectedItemId(null)}
                title="Status da Negociação"
            >
                <Text className="text-sm text-muted-foreground mb-2">
                    Atualize a probabilidade de fechamento deste projeto para alimentar o seu dashboard.
                </Text>
                <View className="gap-2">
                    {(Object.keys(PROBABILITY_COLORS) as Probability[]).map((p) => {
                        const style = PROBABILITY_COLORS[p];
                        return (
                            <Button
                                key={p}
                                variant="secondary"
                                onPress={() => handleUpdateProbability(p)}
                                style={{ backgroundColor: style.bg, borderColor: style.text + '40', borderWidth: 1 }}
                                textStyle={{ color: style.text, fontFamily: 'Inter_700Bold' }}
                                label={style.label}
                            />
                        );
                    })}
                </View>
            </Modal>
        </ScreenContainer>
    );
}
