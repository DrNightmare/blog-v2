export type ProjectCard = {
  slug: string;
  title: string;
  summary: string;
  date: string;
  type: string;
  externalUrl?: string;
};

export const PROJECTS: ProjectCard[] = [
  {
    slug: "speaktype",
    title: "SpeakType",
    summary:
      "Local-first Windows dictation app that leverages on-device Whisper to convert speech into clean text, inserting it into any editor via global hotkeys.",
    date: "Jan 14, 2026",
    type: "Github",
    externalUrl: "https://github.com/DrNightmare/speaktype",
  },
  {
    slug: "atlas",
    title: "Atlas",
    summary:
      "Your smart travel companion. Atlas organizes scattered travel documents into a single, intelligent timeline for stress-free check-ins.",
    date: "Dec 28, 2025",
    type: "Github",
    externalUrl: "https://github.com/DrNightmare/Project-Atlas",
  },
  {
    slug: "vacation-planner",
    title: "Vacation Planner",
    summary:
      "Smart vacation planner that maximizes break quality by prioritizing 4-5 day trips and ensuring they are evenly spaced throughout the year.",
    date: "Jan 12, 2026",
    type: "Tool",
  },
  {
    slug: "knucklebones",
    title: "Knucklebones",
    summary:
      "A dice game of risk and reward. Place dice to match your own or destroy your opponent's.",
    date: "Dec 31, 2024",
    type: "Game",
  },
  {
    slug: "scoundrel",
    title: "Scoundrel",
    summary:
      "A solitaire card dungeon crawler. Navigate the room, equip weapons, and slay monsters to clear the deck.",
    date: "Dec 30, 2024",
    type: "Game",
  },
];
