/**
 * Utilidades para parsing e formatação de valores monetários
 * Padrão brasileiro: R$ 1.000,00 (ponto como milhar, vírgula como decimal)
 */

export const parseNumber = (value: string | number) => {
    if (typeof value === "number") return value;
    const normalized = value
        .trim()
        .replace(/[R$\s]/g, "")
        .replace(/\./g, "")
        .replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

export const parseDeadlineWeeks = (deadline: string) => {
    const match = deadline.match(/(\d+)\s*(semana|semanas|week|weeks)/i);
    if (!match) return null;
    return Number(match[1]);
};

export const clamp = (value: number, min: number = 0, max: number = 100) =>
  Math.min(max, Math.max(min, value));
