export function formatCurrencyInput(value: string) {
    const numeric = value.replace(/\D/g, "");

    if (!numeric) {
        return "0,00";
    }

    const amount = Number(numeric) / 100;

    return amount.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function parseCurrencyInput(value: string) {
    const numeric = value.replace(/\D/g, "").slice(0, 11);

    return numeric;
}
