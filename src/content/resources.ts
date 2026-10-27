// Resource hub articles (static content for v1). Fictional examples, not official SNAPkids guidance.

export const RESOURCE_CATEGORIES = [
  "Adaptive Teaching Techniques",
  "Swimming Games & Activities",
  "Adaptive Equipment & Devices",
  "Water Safety",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export type Resource = {
  id: string;
  category: ResourceCategory;
  title: string;
  summary: string;
  body: string;
  /** Song lyrics, one line per array item; blank string = verse break */
  lyrics?: string[];
  tips: string[];
};

export const RESOURCES: Resource[] = [
  {
    id: "r1",
    category: "Adaptive Teaching Techniques",
    title: "Visual Lesson Schedules",
    summary: "Use picture cards to preview each lesson step.",
    body: "A visual schedule shows swimmers what will happen and in what order. Place cards on deck and let the swimmer move each card to a done box.",
    tips: [
      "Keep it to 4 to 6 steps.",
      "Reuse the same pictures every week.",
    ],
  },
  {
    id: "r2",
    category: "Adaptive Teaching Techniques",
    title: "Calm Entry Routines",
    summary: "A repeatable way to start the lesson in the water.",
    body: "A consistent entry routine lowers anxiety. Pair the same greeting, steps, and song each lesson so the start feels familiar.",
    tips: [
      "Offer choices, like stairs or edge.",
      "Praise each small step.",
    ],
  },
  {
    id: "r3",
    category: "Swimming Games & Activities",
    title: "Bubble Band",
    summary: "A music game that builds breath control.",
    body: "Swimmers blow bubbles to match a rhythm the instructor taps. Start with slow beats and add faster ones as comfort grows.",
    tips: [
      "Use a hum for hesitant swimmers.",
      "Let swimmers lead a round.",
    ],
  },
  {
    id: "r4",
    category: "Swimming Games & Activities",
    title: "Treasure Dive Lane",
    summary: "Gentle object retrieval at shallow depth.",
    body: "Scatter soft rings at knee or waist depth. Swimmers collect them and sort by color, practicing reach, balance, and movement.",
    tips: [
      "Count rings out loud together.",
      "Adjust depth to comfort.",
    ],
  },
  {
    id: "r5",
    category: "Adaptive Equipment & Devices",
    title: "Choosing Floatation Aids",
    summary: "Compare noodles, belts, and vests for support.",
    body: "Different aids give different support and freedom. Start with more support and reduce it gradually as skills build.",
    tips: [
      "Check fit before each lesson.",
      "Rotate aids to avoid dependence.",
    ],
  },
  {
    id: "r6",
    category: "Adaptive Equipment & Devices",
    title: "Pool Access Basics",
    summary: "Ideas for ramps, lifts, and transfer seating.",
    body: "Safe entry and exit shape the whole lesson. Review each facility's equipment and plan transfers before the swimmer arrives.",
    tips: [
      "Practice transfers on dry land first.",
      "Keep equipment within reach.",
    ],
  },
  {
    id: "r7",
    category: "Water Safety",
    title: "Pool Rules in Pictures",
    summary: "Simple illustrated safety rules for the deck.",
    body: "Pair each rule with a clear picture: walk, wait for the instructor, and stay in your lane. Review the rules at every lesson.",
    tips: [
      "Use positive wording.",
      "Post at pool entrance.",
    ],
  },
  {
    id: "r8",
    category: "Water Safety",
    title: "Family Water Safety Checklist",
    summary: "Home and pool habits for every family.",
    body: "Keep constant adult supervision near water, secure gates, and practice what to do if a swimmer needs help.",
    tips: [
      "Choose a designated water watcher.",
      "Review the checklist each season.",
    ],
  },
  {
    id: "r9",
    category: "Swimming Games & Activities",
    title: "Song: Old MacDonald (Pool Version)",
    summary: "A classic farm song with kicks, splashes, and sounds.",
    body: "Sing together and let each animal choose a pool move: duck kicks, cow stretches, pig bubbles. Swimmers can also pick the next animal with a picture card.",
    lyrics: [
      "Old MacDonald had a farm, E-I-E-I-O.",
      "And on his farm he had a duck, E-I-E-I-O.",
      "With a quack-quack here and a quack-quack there,",
      "Here a quack, there a quack, everywhere a quack-quack.",
      "Old MacDonald had a farm, E-I-E-I-O.",
      "",
      "Old MacDonald had a farm, E-I-E-I-O.",
      "And on his farm he had a cow, E-I-E-I-O.",
      "With a moo-moo here and a moo-moo there,",
      "Here a moo, there a moo, everywhere a moo-moo.",
      "Old MacDonald had a farm, E-I-E-I-O.",
    ],
    tips: [
      "Nonverbal swimmers can pick animals with cards.",
      "Match each animal to a kick or splash.",
    ],
  },
  {
    id: "r10",
    category: "Swimming Games & Activities",
    title: "Song: Wheels on the Bus (Splash Version)",
    summary: "Original pool verses sung to the familiar tune.",
    body: "These verses are written for this demo to fit the well-known tune. Add actions for each line and repeat verses as often as the group likes.",
    lyrics: [
      "The kickers in the pool go splash, splash, splash,",
      "splash, splash, splash, splash, splash, splash.",
      "The kickers in the pool go splash, splash, splash,",
      "all through the pool!",
      "",
      "The arms in the pool go round and round,",
      "round and round, round and round.",
      "The arms in the pool go round and round,",
      "all through the pool!",
      "",
      "The bubbles in the pool go blub, blub, blub,",
      "blub, blub, blub, blub, blub, blub.",
      "The bubbles in the pool go blub, blub, blub,",
      "all through the pool!",
    ],
    tips: [
      "Slow the tempo for new swimmers.",
      "Let swimmers invent a new verse.",
    ],
  },
  {
    id: "r11",
    category: "Swimming Games & Activities",
    title: "Song: Row, Row, Row Your Boat",
    summary: "A gentle song for floating and rocking.",
    body: "Swimmers float with support while the group sings slowly. Rock side to side with the beat to build relaxation and trust.",
    lyrics: [
      "Row, row, row your boat,",
      "Gently down the stream.",
      "Merrily, merrily, merrily, merrily,",
      "Life is but a dream.",
    ],
    tips: [
      "Sing softly for sensory comfort.",
      "Pair with a back float goal.",
    ],
  },
];

export function getResource(id: string): Resource | undefined {
  return RESOURCES.find((r) => r.id === id);
}
