import { skalViseModal } from './skalViseAvsluttOppdragModal';

describe('Funksjonen skalViseModal for nudging av lukking av kandidatliste når alle stillinger i listen er besatt', () => {
    test('skal returnere true', () => {
        expect(skalViseModal('ÅPEN', 7, 7, true, null)).toBe(true);
        expect(skalViseModal('ÅPEN', 7, 7, true, 6)).toBe(true);
    });

    test('skal returnere false', () => {
        expect(skalViseModal('LUKKET', 7, 7, true, null)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 6, true, null)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 7, false, null)).toBe(false);
        expect(skalViseModal('ÅPEN', 0, 0, true, null)).toBe(false);
        expect(skalViseModal('ÅPEN', null, 0, true, null)).toBe(false);
        expect(skalViseModal('ÅPEN', null, 7, true, null)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 7, true, 7)).toBe(false);
    });
});
