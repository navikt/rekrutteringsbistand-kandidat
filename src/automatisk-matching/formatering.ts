export const tilProsent = (desimal?: number) => {
    const prosentpoeng = tilProsentpoeng(desimal as number);
    return `${isNaN(prosentpoeng) ? 0 : prosentpoeng}%`;
};

export const tilProsentpoeng = (desimal: any) => {
    return Math.round(desimal * 100);
};
