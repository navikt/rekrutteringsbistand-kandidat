export const getMiljø = (): string => {
    const pathname = window.location.hostname;
    if (pathname.includes('nais.adeo.no')) {
        return 'prod-fss';
    } else if (pathname.includes('nais.preprod.local') || pathname.includes('dev.adeo.no')) {
        return 'dev-fss';
    } else {
        return 'local';
    }
};
