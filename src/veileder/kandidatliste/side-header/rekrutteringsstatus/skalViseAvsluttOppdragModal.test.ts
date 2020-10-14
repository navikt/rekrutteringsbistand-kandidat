import { skalViseModal } from './skalViseAvsluttOppdragModal';

describe('Nudging av lukking av kandidatliste', () => {
    test('Skal vise modal hvis alle stillinger er besatte og du eier kandidatlisten', () => { 
        expect(skalViseModal('ÅPEN', 7, 7, true, undefined)).toBe(true);
    });
    test('Skal vise modal hvis antall stillinger var lavere når den sist ble lukket', () => { 
        expect(skalViseModal('ÅPEN', 7, 7, true, 6)).toBe(true);
    });

    test('skal returnere false', () => {
        expect(skalViseModal('LUKKET', 7, 7, true, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 6, true, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 7, false, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', 0, 0, true, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', null, 0, true, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', null, 7, true, undefined)).toBe(false);
        expect(skalViseModal('ÅPEN', 7, 7, true, 7)).toBe(false);
    });
});
