import GameStateProvider from '@/components/GameStateProvider';

export default function ScoundrelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
