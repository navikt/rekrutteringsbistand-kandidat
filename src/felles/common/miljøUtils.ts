export const getMiljø = (): string => {
    const pathname = window.location.hostname;
    if (pathname.includes('nais.adeo.no')) {
        return 'prod-fss';
    }
    if (pathname.includes('nais.preprod.local')) {
        return 'dev-fss';
    }
    return 'local';
};
