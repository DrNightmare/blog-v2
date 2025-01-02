"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Upgrade = ({ name, description, level, cost, disabled, onPurchase }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-600">{description}</div>
          <div className="text-sm text-gray-600">Level: {level}</div>
        </div>
        <Button
          onClick={onPurchase}
          disabled={disabled}
          className="ml-4"
        >
          ₹{cost}
        </Button>
      </div>
    </div>
  );
};

const DosaClicker = () => {
  const [dosasSold, setDosasSold] = useState(0);
  const [balance, setBalance] = useState(90);
  const [lastSellTime, setLastSellTime] = useState(Date.now());
  const [isCooking, setIsCooking] = useState(false);
  const [upgradesUnlocked, setUpgradesUnlocked] = useState(false);
  const [automationsUnlocked, setAutomationsUnlocked] = useState(false);
  const [upgrades, setUpgrades] = useState({
    hotterStoves: 0,
    fasterSelling: 0,
    autoDosaMaker: 0
  });

  const BASE_COOKING_TIME = 1000;
  const DOSA_PRICE = 5;
  const BASE_SELL_INTERVAL = 1000;

  const getCurrentCookingTime = () => {
    return BASE_COOKING_TIME * Math.pow(0.75, upgrades.hotterStoves);
  };

  const getCurrentSellInterval = () => {
    return BASE_SELL_INTERVAL * Math.pow(0.75, upgrades.fasterSelling);
  };

  useEffect(() => {
    const gameLoop = () => {
      const currentTime = Date.now();
      const timeSinceLastSell = currentTime - lastSellTime;
      const sellInterval = getCurrentSellInterval();

      const sellsDue = Math.floor(timeSinceLastSell / sellInterval);

      if (sellsDue > 0 && dosasSold > 0) {
        const dosasToSell = Math.min(dosasSold, sellsDue);

        if (dosasToSell > 0) {
          setDosasSold(prev => Math.max(0, prev - dosasToSell));
          setBalance(prev => prev + (dosasToSell * DOSA_PRICE));
          setLastSellTime(currentTime);
        }
      }
    };

    const autoDosaLoop = () => {
      if (upgrades.autoDosaMaker > 0) {
        setDosasSold(prev => prev + upgrades.autoDosaMaker);
      }
    };

    const gameLoopId = setInterval(gameLoop, 100);
    const autoDosaId = setInterval(autoDosaLoop, 1000);

    return () => {
      clearInterval(gameLoopId);
      clearInterval(autoDosaId);
    };
  }, [dosasSold, lastSellTime, upgrades]);

  // Check for upgrades unlock
  useEffect(() => {
    if (balance >= 100 && !upgradesUnlocked) {
      setUpgradesUnlocked(true);
    }
    if (balance >= 300 && !automationsUnlocked) {
      setAutomationsUnlocked(true);
    }
  }, [balance, upgradesUnlocked, automationsUnlocked]);

  const makeDosa = () => {
    setIsCooking(true);
    setTimeout(() => {
      setDosasSold(prev => prev + 1);
      setIsCooking(false);
    }, getCurrentCookingTime());
  };

  const purchaseHotterStoves = () => {
    const cost = 100;
    if (balance >= cost && upgrades.hotterStoves < 6) {
      setBalance(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        hotterStoves: prev.hotterStoves + 1
      }));
    }
  };

  const purchaseFasterSelling = () => {
    const cost = 100;
    if (balance >= cost) {
      setBalance(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        fasterSelling: prev.fasterSelling + 1
      }));
    }
  };

  const purchaseAutoDosaMaker = () => {
    const cost = 300;
    if (balance >= cost) {
      setBalance(prev => prev - cost);
      setUpgrades(prev => ({
        ...prev,
        autoDosaMaker: prev.autoDosaMaker + 1
      }));
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Dosa Empire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Dosas Ready</div>
              <div className="text-xl font-bold">{dosasSold}</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Balance</div>
              <div className="text-xl font-bold">₹{balance}</div>
            </div>
          </div>

          <Button 
            onClick={makeDosa}
            disabled={isCooking}
            className="w-full h-16 text-lg"
          >
            {isCooking ? "Cooking..." : "Make Dosa"}
          </Button>

          {upgradesUnlocked && (
            <div className="space-y-4">
              <div className="h-px bg-gray-200" />
              
              <div className="text-lg font-semibold">Upgrades</div>

              <Upgrade
                name="Hotter Stoves"
                description={`Current cooking time: ${(getCurrentCookingTime() / 1000).toFixed(2)}s`}
                level={upgrades.hotterStoves}
                cost={100}
                disabled={balance < 100 || upgrades.hotterStoves >= 6}
                onPurchase={purchaseHotterStoves}
              />

              <Upgrade
                name="Express Delivery"
                description={`Current sell interval: ${(getCurrentSellInterval() / 1000).toFixed(2)}s`}
                level={upgrades.fasterSelling}
                cost={100}
                disabled={balance < 100}
                onPurchase={purchaseFasterSelling}
              />
            </div>
          )}

          {automationsUnlocked && (
            <div className="space-y-4">
              <div className="h-px bg-gray-200" />
              
              <div className="text-lg font-semibold">Automations</div>

              <Upgrade
                name="Auto Dosa Maker"
                description="Automatically makes 1 dosa per second."
                level={upgrades.autoDosaMaker}
                cost={300}
                disabled={balance < 300}
                onPurchase={purchaseAutoDosaMaker}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DosaClicker;
