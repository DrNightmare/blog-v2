import GameStateProvider from '@/components/GameStateProvider';

export default function HolidayOptimizerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
