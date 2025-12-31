'use client';

import React from 'react';
import ScoundrelGame from './scoundrel-game';
import ScoundrelRules from './scoundrel-rules';
import GameProjectContainer from '@/components/GameProjectContainer';

export default function ScoundrelContainer() {
    return (
        <GameProjectContainer
            gameComponent={<ScoundrelGame />}
            rulesComponent={<ScoundrelRules />}
        />
    );
}
