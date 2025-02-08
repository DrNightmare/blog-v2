"use client"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Upgrade = ({ name, description, cost, balance, onPurchase }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
        <Button
          onClick={onPurchase}
          disabled={balance < cost}
          className="ml-4"
        >
          ₹{cost}
        </Button>
      </div>
    </div>
  );
};

const DosaClicker = () => {
  const [dosasReady, setDosasReady] = useState(0);
  const [totalDosasSold, setTotalDosasSold] = useState(0);
  const [balance, setBalance] = useState(0);
  const [lastSellTime, setLastSellTime] = useState(Date.now());
  const [isCooking, setIsCooking] = useState(false);
  const [cookingTime, setCookingTime] = useState(800);
  const [sellInterval, setSellInterval] = useState(2400);
  const [autoDosaMaker, setAutoDosaMaker] = useState(false);
  const [autoDosaMakeCount, setAutoDosaMakeCount] = useState(1);
  const [dosaPrice, setDosaPrice] = useState(5);

  const [availableUpgrades, setAvailableUpgrades] = useState([
    {
      name: "Hotter Stoves",
      description: "Halve the cooking time.",
      cost: 50,
      unlockThreshold: 7,
      apply: () => setCookingTime(prev => prev / 2)
    },
    {
      name: "Express Delivery",
      description: "Halve the selling interval.",
      cost: 60,
      unlockThreshold: 15,
      apply: () => setSellInterval(prev => prev / 2)
    },
    {
      name: "Auto Dosa Maker",
      description: "Automatically makes dosas every second.",
      cost: 100,
      unlockThreshold: 35,
      apply: () => setAutoDosaMaker(true)
    },
    {
      name: "Turbo Stove",
      description: "Revolutionize cooking by halving the cooking time again.",
      cost: 100,
      unlockThreshold: 75,
      apply: () => setCookingTime(prev => prev / 2)
    },
    {
      name: "Lightning Delivery",
      description: "Deliver dosas at lightning speed by halving the selling interval again.",
      cost: 120,
      unlockThreshold: 60,
      apply: () => setSellInterval(prev => prev / 2)
    },
    {
      name: "Double Delight",
      description: "Auto maker produces 2 dosas per second.",
      cost: 150,
      unlockThreshold: 90,
      apply: () => setAutoDosaMakeCount(prev => prev + 1)
    },
    {
      name: "Golden Batter",
      description: "Upgraded flavors, sell each dosa for ₹8.",
      cost: 150,
      unlockThreshold: 130,
      apply: () => setDosaPrice(8)
    }
  ]);

  useEffect(() => {
    const gameLoop = () => {
      const currentTime = Date.now();
      const timeSinceLastSell = currentTime - lastSellTime;

      if (timeSinceLastSell >= sellInterval && dosasReady > 0) {
        const sellsDue = Math.floor(timeSinceLastSell / sellInterval);
        const dosasToSell = Math.min(dosasReady, sellsDue);

        setDosasReady(prev => Math.max(0, prev - dosasToSell));
        setTotalDosasSold(prev => prev + dosasToSell);
        setBalance(prev => prev + (dosasToSell * dosaPrice));
        setLastSellTime(currentTime);
      }
    };

    const autoDosaLoop = () => {
      if (autoDosaMaker) {
        setDosasReady(prev => prev + autoDosaMakeCount);
      }
    };

    const gameLoopId = setInterval(gameLoop, 100);
    const autoDosaId = setInterval(autoDosaLoop, 1000);

    return () => {
      clearInterval(gameLoopId);
      clearInterval(autoDosaId);
    };
  }, [dosasReady, lastSellTime, sellInterval, autoDosaMaker, autoDosaMakeCount]);

  const makeDosa = () => {
    setIsCooking(true);
    setTimeout(() => {
      setDosasReady(prev => prev + 1);
      setIsCooking(false);
    }, cookingTime);
  };

  const purchaseUpgrade = (upgrade) => {
    if (balance >= upgrade.cost) {
      setBalance(prev => prev - upgrade.cost);
      upgrade.apply();
      setAvailableUpgrades(prev => prev.filter(u => u !== upgrade));
    }
  };

  const visibleUpgrades = availableUpgrades.filter(upgrade => totalDosasSold >= upgrade.unlockThreshold);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Dosaverse</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Dosas Ready</div>
              <div className="text-xl font-bold">{dosasReady}</div>
            </div>
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Balance</div>
              <div className="text-xl font-bold">₹{balance}</div>
            </div>
          </div>

          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="text-sm text-gray-600">Total Dosas Sold</div>
            <div className="text-xl font-bold">{totalDosasSold}</div>
          </div>

          <Button 
            onClick={makeDosa}
            disabled={isCooking}
            className="w-full h-16 text-lg"
          >
            {isCooking ? "Cooking..." : "Make Dosa"}
          </Button>

          {visibleUpgrades.map((upgrade, index) => (
            <Upgrade
              key={index}
              name={upgrade.name}
              description={upgrade.description}
              cost={upgrade.cost}
              balance={balance}
              onPurchase={() => purchaseUpgrade(upgrade)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DosaClicker;
