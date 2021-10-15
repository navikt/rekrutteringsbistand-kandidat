import { PopoverOrientering } from 'nav-frontend-popover';
import { useEffect, useState } from 'react';

const usePopoverOrientering = (popoverAnker?: HTMLButtonElement) => {
    const [popoverOrientering, setPopoverOrientering] = useState<PopoverOrientering>(
        PopoverOrientering.Under
    );

    useEffect(() => {
        if (popoverAnker) {
            const yPosForAnker = popoverAnker?.getBoundingClientRect().y;
            const yMaxForVindu = window.innerHeight;
            const popoverAnkerErINedersteSjikteAvSkjerm = yPosForAnker / yMaxForVindu > 0.4;

            setPopoverOrientering(
                popoverAnkerErINedersteSjikteAvSkjerm
                    ? PopoverOrientering.OverHoyre
                    : PopoverOrientering.UnderHoyre
            );
        }
    }, [popoverAnker]);

    return popoverOrientering;
};

export default usePopoverOrientering;
