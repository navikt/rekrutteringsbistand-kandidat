import { erGyldigEpost } from './epostValidering';

describe('Epostvalidering', () => {
    test('Epost med punktum skal være gyldig', () => {
        expect(erGyldigEpost('mitt.navn@nav.no')).toBe(true);
    });

    test('Epost med mellomrom skal være ugyldig', () => {
        expect(erGyldigEpost('mitt .navn@nav.no')).toBe(false);
    });

    test('Epost med > kopiert feil fra Outlook skal være ugyldig', () => {
        expect(erGyldigEpost('mitt.navn@nav.no>')).toBe(false);
    });
});
