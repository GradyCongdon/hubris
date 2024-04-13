'use client';
import { useCallback, useEffect, useState } from 'react';
import { setCookie } from '@/app/cookie-actions';
import { usePathname } from 'next/navigation';

export const useClaim = (rCodeDefault = '', characterShortDefault = '') => {
  const [rCode, setRCode] = useState(rCodeDefault);
  const [characterShort, setCharacterShort] = useState(characterShortDefault);
  const pathname = usePathname();
  const currentPageRCode = pathname.split("/")[2];
  const currentCharacterShort = pathname.split("/")[3];
  const isCurrentClaim = rCode === currentPageRCode && characterShort === currentCharacterShort;
  useEffect(() => {
    setCookie('rCode', rCode);
    setCookie('characterShort', characterShort);
  }, [rCode, characterShort]);

  const claim = useCallback(() => {
    setRCode(currentPageRCode);
    setCharacterShort(currentCharacterShort);
    window.analytics.track("Player Claim", { rCode, characterShort});
    console.log("Player Claimed", rCode, characterShort);
  }, [currentPageRCode, currentCharacterShort, rCode, characterShort]);

  return { rCode, characterShort, claim, isCurrentClaim };

}
