import React, { useState, useMemo } from "react";
import { FlatList, Text, View, Pressable, TextInput, Alert } from "react-native";
import { Trash2, Search, DollarSign, Calendar, Sliders } from "lucide-react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, Button, MotionFadeUp } from "@/components/ui";
import { useHistoryStore } from "@/store";
import { formatCurrency } from "@/utils";

export default function HistoryScreen() {
    const { items, removeItem } = useHistoryStore();
    const [search, setSearch] = useState("");

    // Filtered items based on search input
    const filteredItems = useMemo(() => {
        if (!search.trim()) return items;
        return items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [items, search]);

    // Aggregate calculations
    const totals = useMemo(() => {
        const count = filteredItems.length;
        const totalValue = filteredItems.reduce((acc, item) => acc + item.value, 0);
        return { count, totalValue };
    }, [filteredItems]);

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            "Excluir cálculo",
            `Deseja realmente remover o cálculo do projeto "${name}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Remover",
                    style: "destructive",
                    onPress: async () => {
                        await removeItem(id);
                    },
                },
            ]
        );
    };

    return (
        <ScreenContainer>
            <View className="gap-6 pb-24">
                <View className="gap-1">
                    <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                        Histórico de Precificações
                    </Text>
                    <Text className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter_400Regular' }}>
                        Acompanhe, busque e gerencie suas propostas salvas.
                    </Text>
                </View>

                {/* Dashboard Metrics Card */}
                <Card variant="elevated" className="p-5 flex-row justify-between items-center bg-slate-900/5 dark:bg-slate-900/40 border border-border dark:border-white/5">
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

                {/* Search Bar Input */}
                <View className="flex-row items-center border border-border dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-900/20 px-3 py-2 gap-2">
                    <Search size={18} className="text-muted-foreground" />
                    <TextInput
                        placeholder="Buscar por tipo de projeto..."
                        placeholderTextColor="#94a3b8"
                        value={search}
                        onChangeText={setSearch}
                        className="flex-1 text-sm text-foreground dark:text-white"
                        style={{ outlineStyle: 'none' } as any}
                    />
                    {search.length > 0 && (
                        <Pressable onPress={() => setSearch("")}>
                            <Text className="text-xs text-primary font-medium">Limpar</Text>
                        </Pressable>
                    )}
                </View>

                {/* List Container */}
                {filteredItems.length === 0 ? (
                    <MotionFadeUp delay={300} className="py-12 items-center justify-center gap-3">
                        <Sliders size={32} className="text-muted-foreground/40" />
                        <Text className="text-base text-muted-foreground text-center font-medium">
                            {search.length > 0 ? "Nenhum cálculo corresponde à busca." : "Nenhum cálculo salvo ainda."}
                        </Text>
                    </MotionFadeUp>
                ) : (
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => (
                            <MotionFadeUp delay={200 + index * 100} className="mb-4">
                                <Card variant="glass" className="p-4 flex-row justify-between items-center">
                                    <View className="flex-1 gap-2 pr-3">
                                        <View className="gap-0.5">
                                            <Text className="text-base text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                                                {item.name}
                                            </Text>
                                            <View className="flex-row items-center gap-1.5">
                                                <Calendar size={12} className="text-muted-foreground" />
                                                <Text className="text-xs text-muted-foreground">
                                                    {item.date || new Date(item.createdAt).toLocaleDateString("pt-BR")}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text className="text-lg text-primary" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                                            {formatCurrency(item.value)}
                                        </Text>
                                    </View>

                                    <Pressable
                                        onPress={() => handleDelete(item.id, item.name)}
                                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-transform"
                                    >
                                        <Trash2 size={18} className="text-red-500" />
                                    </Pressable>
                                </Card>
                            </MotionFadeUp>
                        )}
                    />
                )}
            </View>
        </ScreenContainer>
    );
}
