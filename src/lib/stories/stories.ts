export type StoryPassage = {
  bookAbbrev: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  label: string;
};

export type BibleStory = {
  id: string;
  title: string;
  summary: string;
  testament: "OT" | "NT";
  theme: string;
  passages: StoryPassage[];
};

export const BIBLE_STORIES: BibleStory[] = [
  {
    id: "creation",
    title: "Creation",
    theme: "Beginnings",
    testament: "OT",
    summary:
      "In the beginning, God created the heavens and the earth. In six days He formed light, sky, land, seas, plants, stars, animals, and humankind — and on the seventh day He rested.",
    passages: [
      { bookAbbrev: "gn", chapter: 1, label: "Genesis 1" },
      { bookAbbrev: "gn", chapter: 2, verseStart: 1, verseEnd: 3, label: "Genesis 2:1–3" },
    ],
  },
  {
    id: "adam-eve",
    title: "Adam and Eve",
    theme: "The Fall",
    testament: "OT",
    summary:
      "God placed Adam and Eve in Eden with one command. Tempted by the serpent, they ate from the forbidden tree. Sin entered the world — yet God still sought them and promised hope.",
    passages: [
      { bookAbbrev: "gn", chapter: 2, verseStart: 15, verseEnd: 25, label: "Genesis 2:15–25" },
      { bookAbbrev: "gn", chapter: 3, label: "Genesis 3" },
    ],
  },
  {
    id: "noah-ark",
    title: "Noah and the Ark",
    theme: "Judgment & Mercy",
    testament: "OT",
    summary:
      "When wickedness filled the earth, God told Noah to build an ark. Rain fell for forty days. Noah’s family and the animals were saved, and God set a rainbow as a covenant of mercy.",
    passages: [
      { bookAbbrev: "gn", chapter: 6, label: "Genesis 6" },
      { bookAbbrev: "gn", chapter: 7, label: "Genesis 7" },
      { bookAbbrev: "gn", chapter: 8, label: "Genesis 8" },
      { bookAbbrev: "gn", chapter: 9, verseStart: 1, verseEnd: 17, label: "Genesis 9:1–17" },
    ],
  },
  {
    id: "abraham-isaac",
    title: "Abraham and Isaac",
    theme: "Faith",
    testament: "OT",
    summary:
      "God tested Abraham, asking him to offer Isaac. Abraham obeyed in faith. At the last moment, God provided a ram — showing that He Himself would provide.",
    passages: [
      { bookAbbrev: "gn", chapter: 22, label: "Genesis 22" },
    ],
  },
  {
    id: "joseph",
    title: "Joseph in Egypt",
    theme: "Providence",
    testament: "OT",
    summary:
      "Sold by his brothers, Joseph became a slave, then a prisoner, then ruler in Egypt. What others meant for harm, God used to save many lives.",
    passages: [
      { bookAbbrev: "gn", chapter: 37, label: "Genesis 37" },
      { bookAbbrev: "gn", chapter: 39, label: "Genesis 39" },
      { bookAbbrev: "gn", chapter: 41, label: "Genesis 41" },
      { bookAbbrev: "gn", chapter: 45, label: "Genesis 45" },
    ],
  },
  {
    id: "moses-exodus",
    title: "Moses and the Exodus",
    theme: "Deliverance",
    testament: "OT",
    summary:
      "God called Moses from a burning bush to free Israel from Egypt. Through plagues and the parting of the Red Sea, the Lord brought His people out with a mighty hand.",
    passages: [
      { bookAbbrev: "ex", chapter: 3, label: "Exodus 3" },
      { bookAbbrev: "ex", chapter: 12, label: "Exodus 12" },
      { bookAbbrev: "ex", chapter: 14, label: "Exodus 14" },
    ],
  },
  {
    id: "david-goliath",
    title: "David and Goliath",
    theme: "Courage",
    testament: "OT",
    summary:
      "A young shepherd faced a giant warrior. With a sling, five stones, and trust in the living God, David defeated Goliath and showed that the battle belongs to the Lord.",
    passages: [
      { bookAbbrev: "1sm", chapter: 17, label: "1 Samuel 17" },
    ],
  },
  {
    id: "daniel-lions",
    title: "Daniel in the Lions’ Den",
    theme: "Faithfulness",
    testament: "OT",
    summary:
      "Daniel kept praying to God even when it was outlawed. Thrown into a den of lions, he was unharmed — and the king learned that Daniel’s God is the living God.",
    passages: [
      { bookAbbrev: "dn", chapter: 6, label: "Daniel 6" },
    ],
  },
  {
    id: "jonah",
    title: "Jonah and the Great Fish",
    theme: "Mercy",
    testament: "OT",
    summary:
      "Jonah ran from God’s call to preach in Nineveh. A storm and a great fish turned him around. When Nineveh repented, God showed mercy — and taught Jonah about compassion.",
    passages: [
      { bookAbbrev: "jn", chapter: 1, label: "Jonah 1" },
      { bookAbbrev: "jn", chapter: 2, label: "Jonah 2" },
      { bookAbbrev: "jn", chapter: 3, label: "Jonah 3" },
      { bookAbbrev: "jn", chapter: 4, label: "Jonah 4" },
    ],
  },
  {
    id: "birth-of-jesus",
    title: "The Birth of Jesus",
    theme: "Incarnation",
    testament: "NT",
    summary:
      "In Bethlehem, Mary gave birth to Jesus. Angels announced good news to shepherds, and wise men came to worship the newborn King — God with us.",
    passages: [
      { bookAbbrev: "lk", chapter: 2, verseStart: 1, verseEnd: 20, label: "Luke 2:1–20" },
      { bookAbbrev: "mt", chapter: 2, verseStart: 1, verseEnd: 12, label: "Matthew 2:1–12" },
    ],
  },
  {
    id: "jesus-baptism",
    title: "The Baptism of Jesus",
    theme: "Beginning of Ministry",
    testament: "NT",
    summary:
      "Jesus came to John at the Jordan. As He was baptized, the heavens opened, the Spirit descended like a dove, and the Father’s voice declared: “This is My beloved Son.”",
    passages: [
      { bookAbbrev: "mt", chapter: 3, verseStart: 13, verseEnd: 17, label: "Matthew 3:13–17" },
    ],
  },
  {
    id: "sermon-mount",
    title: "The Sermon on the Mount",
    theme: "Teaching",
    testament: "NT",
    summary:
      "On a mountainside, Jesus taught about the kingdom of heaven — blessing the meek, calling for love of enemies, and showing what it means to seek God first.",
    passages: [
      { bookAbbrev: "mt", chapter: 5, label: "Matthew 5" },
      { bookAbbrev: "mt", chapter: 6, label: "Matthew 6" },
      { bookAbbrev: "mt", chapter: 7, label: "Matthew 7" },
    ],
  },
  {
    id: "feeding-5000",
    title: "Feeding the Five Thousand",
    theme: "Provision",
    testament: "NT",
    summary:
      "With five loaves and two fish, Jesus fed a hungry crowd. Everyone ate and was satisfied — and twelve baskets of leftovers remained.",
    passages: [
      { bookAbbrev: "jo", chapter: 6, verseStart: 1, verseEnd: 14, label: "John 6:1–14" },
    ],
  },
  {
    id: "good-samaritan",
    title: "The Good Samaritan",
    theme: "Compassion",
    testament: "NT",
    summary:
      "Asked “Who is my neighbor?”, Jesus told of a wounded man ignored by the religious, then helped by a Samaritan. Go and do likewise.",
    passages: [
      { bookAbbrev: "lk", chapter: 10, verseStart: 25, verseEnd: 37, label: "Luke 10:25–37" },
    ],
  },
  {
    id: "prodigal-son",
    title: "The Prodigal Son",
    theme: "Grace",
    testament: "NT",
    summary:
      "A son wasted his inheritance and came home empty. His father ran to meet him with open arms — a picture of God’s joy when a sinner returns.",
    passages: [
      { bookAbbrev: "lk", chapter: 15, verseStart: 11, verseEnd: 32, label: "Luke 15:11–32" },
    ],
  },
  {
    id: "lazarus",
    title: "Lazarus Raised",
    theme: "Resurrection Power",
    testament: "NT",
    summary:
      "Jesus wept at the tomb of His friend Lazarus, then called him out of death. Many believed — and Jesus showed He is the resurrection and the life.",
    passages: [
      { bookAbbrev: "jo", chapter: 11, label: "John 11" },
    ],
  },
  {
    id: "crucifixion",
    title: "The Cross",
    theme: "Sacrifice",
    testament: "NT",
    summary:
      "Jesus was crucified at Calvary. He bore the sin of the world, cried “It is finished,” and gave His life — the Lamb of God who takes away sin.",
    passages: [
      { bookAbbrev: "jo", chapter: 19, label: "John 19" },
      { bookAbbrev: "mt", chapter: 27, verseStart: 27, verseEnd: 56, label: "Matthew 27:27–56" },
    ],
  },
  {
    id: "resurrection",
    title: "The Resurrection",
    theme: "Victory",
    testament: "NT",
    summary:
      "On the third day the tomb was empty. Jesus appeared to Mary, to the disciples, and to many others — risen indeed, conquering death forever.",
    passages: [
      { bookAbbrev: "jo", chapter: 20, label: "John 20" },
      { bookAbbrev: "lk", chapter: 24, label: "Luke 24" },
    ],
  },
  {
    id: "pentecost",
    title: "Pentecost",
    theme: "The Spirit",
    testament: "NT",
    summary:
      "The Holy Spirit came upon the disciples with wind and fire. Peter preached, and thousands believed — the church was born in power.",
    passages: [
      { bookAbbrev: "act", chapter: 2, label: "Acts 2" },
    ],
  },
  {
    id: "paul-conversion",
    title: "Paul’s Conversion",
    theme: "Calling",
    testament: "NT",
    summary:
      "Saul persecuted the church until a light from heaven stopped him on the road to Damascus. Blinded, then healed, he became Paul — apostle to the nations.",
    passages: [
      { bookAbbrev: "act", chapter: 9, verseStart: 1, verseEnd: 22, label: "Acts 9:1–22" },
    ],
  },
];

export function getStory(id: string): BibleStory | undefined {
  return BIBLE_STORIES.find((s) => s.id === id);
}

export function storiesByTestament(testament: "all" | "OT" | "NT") {
  if (testament === "all") return BIBLE_STORIES;
  return BIBLE_STORIES.filter((s) => s.testament === testament);
}
