import React from 'react';

import { Kandidatlistestatus as Status } from '../../kandidatlistetyper';
import { skalViseModal } from './Kandidatlistestatus';

test('Kan åpne modal', () => {
    const res = skalViseModal(
        false, Status.Åpen, 7, 7, true
    )
    expect(res).toBe(true);
});
