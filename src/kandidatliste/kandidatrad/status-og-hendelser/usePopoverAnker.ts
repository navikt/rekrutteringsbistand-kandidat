import { MouseEvent, MutableRefObject, useState } from 'react';

const usePopoverAnker = (popoverRef: MutableRefObject<HTMLElement | null>) => {
    const [popoverAnker, setPopoverAnker] = useState<HTMLButtonElement | undefined>(undefined);

    const togglePopover = (event: MouseEvent<HTMLButtonElement>) => {
        setPopoverAnker(popoverAnker ? undefined : event.currentTarget);
    };

    const lukkPopover = () => {
        const noeIPopoverErFokusert = popoverRef?.current?.contains(document.activeElement);
        if (noeIPopoverErFokusert) {
            popoverAnker?.focus();
        }

        setPopoverAnker(undefined);
    };

    return { popoverAnker, togglePopover, lukkPopover };
};

export default usePopoverAnker;
