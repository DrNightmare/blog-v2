import GameStateProvider from '@/components/GameStateProvider';

export default function KnucklebonesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GameStateProvider>{children}</GameStateProvider>;
}
