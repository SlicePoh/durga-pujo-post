// Durga Puja background scenes. Each song can point to one of these via `bg`.
// Same filenames exist in both `style1` and `style2` folders — user can toggle style.
export const BACKGROUNDS = [
  { id: "mohaloya", file: "mohaloya.png", label: "Mahalaya", vibe: "Dawn of Devi Paksha" },
  { id: "kumortuli", file: "kumortuli.png", label: "Kumortuli", vibe: "Idols taking shape" },
  { id: "bonedi1", file: "bonedi1.png", label: "Bonedi Bari", vibe: "Old family courtyard" },
  { id: "bonedi2", file: "bonedi2.png", label: "Raj Bari", vibe: "Heritage and royal Puja" },
  { id: "pandal", file: "pandal.png", label: "Pandal", vibe: "Pandal hopping" },
  { id: "night", file: "night.png", label: "Night Lights", vibe: "Illuminated streets" },
];

export const BACKGROUND_STYLES = ["style1", "style2"];

export const PUJA_PLAYLIST = [
  {
    id: "jago-durga",
    audioUrl: "/audio/Jago Durga Dashapraharanadharinee_spotdown.org.mp3",
    title: "Jago Durga Dashapraharanadharinee",
    artist: "Dwijen Mukherjee",
    movie: "Durga Vandana",
    cover: "https://i.scdn.co/image/ab67616d00001e022a497efb96016d4d26cb83b4",
    bg: "mohaloya"
  },
  {
    id: "dugga-elo",
    audioUrl: "/audio/Dugga Elo_spotdown.org.mp3",
    title: "Dugga Elo",
    artist: "Monali Thakur & Guddu",
    movie: "Dugga Elo (2019)",
    cover: "https://i.scdn.co/image/ab67616d00001e02877df1f4d86607531a93ead2",
    bg: "kumortuli"
  },
  {
    id: "kine-de-reshmi",
    audioUrl: "/audio/Kine De Reshmi Churi_spotdown.org.mp3",
    title: "Kine De Reshmi Churi",
    artist: "Asha Bhosle & R. D. Burman",
    movie: "Serashilpi Seragaan (1983)",
    cover: "https://i.scdn.co/image/ab67616d00001e020696b46de071010225b7cd4c",
    bg: "pandal"
  },
  {
    id: "emon-madhur",
    audioUrl: "/audio/Emon Madhur Sandhyay_spotdown.org.mp3",
    title: "Emon Madhur Sandhyay",
    artist: "Asha Bhosle & R. D. Burman",
    movie: "Ekanta Apan (1987)",
    cover: "https://i.scdn.co/image/ab67616d00001e0288eb8bd72f0b5f649c941797",
    bg: "night"
  },
  {
    id: "dugga-ma",
    audioUrl: "/audio/Dugga Ma_spotdown.org.mp3",
    title: "Dugga Ma",
    artist: "Arijit Singh & Arindom",
    movie: "Bolo Dugga Maiki (2017)",
    cover: "https://i.scdn.co/image/ab67616d00001e022cf78e9352b8cdb025babdf5",
    bg: "bonedi2"
  },
  {
    id: "dhaker-taley",
    audioUrl: "/audio/Dhaker Taley_spotdown.org.mp3",
    title: "Dhaker Taley",
    artist: "Abhijeet, Parineeta, Sudipto & Jeet Gannguli",
    movie: "Poran Jaye Joliya Re (2009)",
    cover: "https://i.scdn.co/image/ab67616d00001e026c1900d916af2dc72ba7c9eb",
    bg: "bonedi1"
  },
  {
    id: "chirodini-tumi",
    audioUrl: "/audio/Chirodini Tumi Je Aamar - Male Version_spotdown.org.mp3",
    title: "Chirodini Tumi Je Aamar",
    artist: "Kishore Kumar",
    movie: "Amor Sanghi (1987)",
    cover: "https://i.scdn.co/image/ab67616d00001e02d60dfc26dd405ebb9ae11ef9",
    bg: "pandal"
  },
  {
    id: "aar-koto-raat",
    audioUrl: "/audio/Aar Koto Raat Eka Thakbo_spotdown.org.mp3",
    title: "Aar Koto Raat Eka Thakbo",
    artist: "Bappi Lahiri & Asha Bhosle",
    movie: "Chokher Aloye (1989)",
    cover: "https://i.scdn.co/image/ab67616d00001e0227f30dba0f8f29ef9a080177",
    bg: "night"
  },
  {
    id: "dhak-baja",
    audioUrl: "/audio/Dhak Baja Kashor Baja_spotdown.org.mp3",
    title: "Dhak Baja Kashor Baja",
    artist: "Shreya Ghoshal & Jeet Gannguli",
    movie: "Dhak Baja Kashor Baja (2016)",
    cover: "https://i.scdn.co/image/ab67616d00001e0221792f8da1279de3b03b4b80",
    bg: "bonedi2"
  },
  {
    id: "bajlo-tomar",
    audioUrl: "/audio/Bajlo Tomar Aalor Benu With Narration_spotdown.org.mp3",
    title: "Bajlo Tomar Aalor Benu",
    artist: "Supriti Ghosh",
    movie: "Bajlo Tomar Aalor Benu",
    cover: "https://i.scdn.co/image/ab67616d00001e02759df1fcaea412cb5dbd5dca",
    bg: "mohaloya"
  },
  {
    id: "aaj-ei-dintake",
    audioUrl: "/audio/Aaj Ei Dintake_spotdown.org.mp3",
    title: "Aaj Ei Dintake",
    artist: "Kishore Kumar",
    movie: "Ei Toh Aamader Kishore (2022)",
    cover: "https://i.scdn.co/image/ab67616d00001e0206f8db75dac07d9bbb5cbb79",
    bg: "pandal"
  },
  {
    id: "katha-hoyechhilo",
    audioUrl: "/audio/Katha Hoyechhilo_spotdown.org.mp3",
    title: "Katha Hoyechhilo",
    artist: "Asha Bhosle",
    movie: "Katha Hoyechhilo (2023)",
    cover: "https://i.scdn.co/image/ab67616d00001e02c503a1a8f61453b187e65441",
    bg: "night"
  },
  {
    id: "ebar-jeno",
    audioUrl: "/audio/Ebar Jeno Onno Rokom Pujo_spotdown.org.mp3",
    title: "Ebar Jeno Onno Rokom Pujo",
    artist: "Nakash Aziz, Antara Mitra & Indraadip Dasgupta",
    movie: "Yoddha (2014)",
    cover: "https://i.scdn.co/image/ab67616d00001e02dff82889c347a6db8a7e4fe5",
    bg: "bonedi1"
  },
  {
    id: "pujo-pujo-gondho",
    audioUrl: "/audio/Pujo Pujo Gondho_spotdown.org.mp3",
    title: "Pujo Pujo Gondho",
    artist: "Anupam Roy",
    movie: "Pujo Pujo Gondho (2024)",
    cover: "https://i.scdn.co/image/ab67616d00001e02fd67fb9b5f35789bae6d9164",
    bg: "kumortuli"
  },
  {
    id: "amay-prashna",
    audioUrl: "/audio/Amay Prashna Kare Neel Dhrubatara_spotdown.org.mp3",
    title: "Amay Prashna Kare Neel Dhrubatara",
    artist: "Hemanta Mukherjee",
    movie: "Bengali Monsoon Hits",
    cover: "https://i.scdn.co/image/ab67616d00001e02f491a7122a0f3d468668b85c",
    bg: "pandal"
  },
  {
    id: "ekta-deshlai",
    audioUrl: "/audio/Ekta Deshlai Kathi Jwalao_spotdown.org.mp3",
    title: "Ekta Deshlai Kathi Jwalao",
    artist: "Asha Bhosle & R. D. Burman",
    movie: "Puja Hits 81\u201384",
    cover: "https://i.scdn.co/image/ab67616d00001e027e16ff5c21b1e73830514660",
    bg: "night"
  },
  {
    id: "ailo-uma",
    audioUrl: "/audio/Ailo Uma Barite_spotdown.org.mp3",
    title: "Ailo Uma Barite",
    artist: "Antara Nandy & Monami Ghosh",
    movie: "Ailo Uma Barite (2023)",
    cover: "https://i.scdn.co/image/ab67616d00001e02975a4dfd90939c56f283b89e",
    bg: "bonedi2"
  },
  {
    id: "shubho-shubho",
    audioUrl: "/audio/Shubho Shubho_spotdown.org.mp3",
    title: "Shubho Shubho",
    artist: "Amit Trivedi & Altamash Faridi",
    movie: "Mrs. Chatterjee Vs Norway (2023)",
    cover: "https://i.scdn.co/image/ab67616d00001e02cd14760154723de30cbf1b3d",
    bg: "bonedi1"
  },
  {
    id: "priyotama",
    audioUrl: "/audio/Priyotama Mone Rekho_spotdown.org.mp3",
    title: "Priyotama Mone Rekho",
    artist: "Kumar Sanu",
    movie: "Naktala Udayan Sangha (2009)",
    cover: "https://i.scdn.co/image/ab67616d00001e02d7442b40644b339907f7dd1d",
    bg: "pandal"
  },
  {
    id: "shundori-komola",
    audioUrl: "/audio/Shundori Komola_spotdown.org.mp3",
    title: "Shundori Komola",
    artist: "Armaan Malik & Antara Mitra",
    movie: "Villain (2018)",
    cover: "https://i.scdn.co/image/ab67616d00001e02f1655c062fdaad4007ce5a74",
    bg: "bonedi2"
  },
  {
    id: "jago-uma",
    audioUrl: "/audio/Jago Uma_spotdown.org.mp3",
    title: "Jago Uma",
    artist: "Rupankar Bagchi & Anupam Roy",
    movie: "Uma (2018)",
    cover: "https://i.scdn.co/image/ab67616d00001e027e002e228aecc71e772cbfa2",
    bg: "mohaloya"
  },
  {
    id: "gold-priter",
    audioUrl: "/audio/Gold Priter Sari_spotdown.org.mp3",
    title: "Gold Priter Sari",
    artist: "Mita Chatterjee",
    movie: "Sukheri Chowate (2018)",
    cover: "https://i.scdn.co/image/ab67616d00001e024084058303be1a2542d3f556",
    bg: "pandal"
  },
  {
    id: "uma-ashe",
    audioUrl: "/audio/Uma Ashe Notun Saje_spotdown.org.mp3",
    title: "Uma Ashe Notun Saje",
    artist: "Ankita Bhattacharyya",
    movie: "Uma Ashe Notun Saje (2024)",
    cover: "https://i.scdn.co/image/ab67616d00001e024a43a4253ff8aaa5cde609c4",
    bg: "kumortuli"
  }
];

export const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/7FIG5Rc1VdN41ub2rZUNcP";
export const YOUTUBE_MUSIC_PLAYLIST_URL = "https://music.youtube.com/playlist?list=PLakxceWWkI7w";
export const SPOTIFY_EMBED_SRC = "https://open.spotify.com/embed/playlist/7FIG5Rc1VdN41ub2rZUNcP?utm_source=generator&si=32b38e06c09a4ef9";
