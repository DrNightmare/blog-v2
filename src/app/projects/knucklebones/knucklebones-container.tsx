'use client';

import React from 'react';
import KnucklebonesGame from './knucklebones-game';
import KnucklebonesRules from './knucklebones-rules';
import GameProjectContainer from '@/components/GameProjectContainer';

export default function KnucklebonesContainer() {
    return (
        <GameProjectContainer
            gameComponent={<KnucklebonesGame />}
            rulesComponent={<KnucklebonesRules />}
        />
    );
}
