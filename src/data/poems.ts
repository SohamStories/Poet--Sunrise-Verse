export interface Poem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  image: string;
  readTime: string;
}

export const poems: Poem[] = [
  {
    id: '1',
    slug: 'morning-light',
    title: 'Morning Light',
    excerpt: 'The valley wakes in gold, as dawn unfolds her tender wings...',
    content: `The valley wakes in gold,
As dawn unfolds her tender wings.
The mist, a silver veil,
Reveals what night had hid.

Each blade of grass holds dew,
A universe in miniature.
The birds begin their song,
A chorus old as time.

I stand at edge of day,
My shadow long and lean.
The sun climbs slow and sure,
To warm the waking world.

In this quiet hour,
Before the rush begins,
I find my words take flight,
Like birds on morning breeze.`,
    date: '2026-01-15',
    tags: ['nature', 'morning', 'hope'],
    image: '/images/poem-card-1.jpg',
    readTime: '2 min'
  },
  {
    id: '2',
    slug: 'quiet-roads',
    title: 'Quiet Roads',
    excerpt: 'Dust settles where the footsteps fade, on paths that wind through memory...',
    content: `Dust settles where the footsteps fade,
On paths that wind through memory.
The old road knows my name,
Though I have been away.

Each crack tells stories,
Of journeys made and lost.
The stones hold warmth still,
From summer suns long past.

I walk these quiet roads,
Where silence is a friend.
The trees lean in to listen,
As if they understand.

What words I leave behind,
Are carried by the wind.
To places I may never see,
But somehow still belong.`,
    date: '2026-01-08',
    tags: ['memory', 'nature', 'pain'],
    image: '/images/poem-card-2.jpg',
    readTime: '2 min'
  },
  {
    id: '3',
    slug: 'small-joys',
    title: 'Small Joys',
    excerpt: 'A cup, a window, a moment stolen from the rushing day...',
    content: `A cup, a window, a moment stolen
From the rushing day.
Steam rises like a prayer,
To the quiet morning light.

The world outside moves fast,
But here, time slows its pace.
I count the small joys:
Warmth, light, the simple grace.

A bird upon the sill,
A song without demand.
The coffee tastes of earth,
Ground fine by careful hands.

These moments make a life,
Not grand, but deeply true.
In small joys, I find
The meaning of the days.`,
    date: '2026-01-01',
    tags: ['love', 'morning', 'hope'],
    image: '/images/poem-card-3.jpg',
    readTime: '2 min'
  },
  {
    id: '4',
    slug: 'evening-hush',
    title: 'Evening Hush',
    excerpt: 'The day exhales its final breath, in colors painted on the sky...',
    content: `The day exhales its final breath,
In colors painted on the sky.
The sun dips low and slow,
To kiss the distant hills.

Shadows stretch and yawn,
As darkness tiptoes in.
The first star wakes and blinks,
A diamond in the dim.

I watch the world grow still,
As evening holds her hush.
The noise of day recedes,
Like waves upon the shore.

In this between of times,
Neither day nor night,
I find the words that hide,
In ordinary light.`,
    date: '2025-12-25',
    tags: ['nature', 'evening', 'hope'],
    image: '/images/poem-card-1.jpg',
    readTime: '2 min'
  },
  {
    id: '5',
    slug: 'letters-never-sent',
    title: 'Letters Never Sent',
    excerpt: 'I write to you in silence, words that never find the mail...',
    content: `I write to you in silence,
Words that never find the mail.
Each letter holds a heart,
That beats beneath the ink.

I tell you of my days,
The small and large events.
I share my fears, my hopes,
My dreams of what could be.

These pages know your name,
Though you may never read.
They hold the love I carry,
Like stones within my chest.

Perhaps one day I'll send them,
Or burn them in the fire.
For now, they rest in drawers,
My letters never sent.`,
    date: '2025-12-18',
    tags: ['love', 'pain'],
    image: '/images/poem-card-2.jpg',
    readTime: '2 min'
  },
  {
    id: '6',
    slug: 'rain-song',
    title: 'Rain Song',
    excerpt: 'The sky opens its heart, and weeps upon the thirsty earth...',
    content: `The sky opens its heart,
And weeps upon the thirsty earth.
Each drop a note of music,
In nature's symphony.

The roof becomes a drum,
The windows weep with mist.
The world turns soft and gray,
In rain's gentle embrace.

I stand beneath the eaves,
And listen to the song.
The rain speaks ancient tongues,
Of renewal and of rest.

In this wet symphony,
I find my soul refreshed.
The rain washes clean,
What time had made a mess.`,
    date: '2025-12-11',
    tags: ['nature', 'hope'],
    image: '/images/poem-card-3.jpg',
    readTime: '2 min'
  }
];

export const allTags = ['all', 'nature', 'love', 'hope', 'pain', 'morning', 'evening'];
