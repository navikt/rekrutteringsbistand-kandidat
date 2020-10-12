import { skalViseModal } from './testables';

describe('Funksjonen skalViseModal for nudging av lukking av kandidatliste når alle stillinger i listen er besatt', () => {
    test('skal returnere true', () => {
        expect(skalViseModal(false, 'ÅPEN', 7, 7, true)).toBe(true);
    });

    test('skal returnere false', () => {
        expect(skalViseModal(true, 'ÅPEN', 7, 7, true)).toBe(false);
        expect(skalViseModal(false, 'LUKKET', 7, 7, true)).toBe(false);
        expect(skalViseModal(false, 'ÅPEN', 7, 6, true)).toBe(false);
        expect(skalViseModal(false, 'ÅPEN', 7, 7, false)).toBe(false);
        expect(skalViseModal(false, 'ÅPEN', 0, 0, true)).toBe(false);
        expect(skalViseModal(false, 'ÅPEN', null, 0, true)).toBe(false);
    });
});
