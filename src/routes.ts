import Stories from './components/Stories';
import Story from './components/Story';
import Words from './components/Words';
import Word from './components/Word';
import Settings from './components/Settings';
import Feedback from './components/Feedback';
import NotFound from './components/NotFound';

type Routes = {
  [K: string]: {
    path: 'string';
    name: string;
  };
};

export default {
  word: {
    path: '/stories/:id/words/study',
    component: Word,
  },
  words: {
    path: '/stories/:id/words',
    component: Words,
    name: 'Cлова',
  },
  story: {
    path: '/stories/:id',
    component: Story,
  },
  stories: {
    path: '/stories',
    component: Stories,
    name: 'Истории',
  },
  settings: {
    path: '/settings',
    component: Settings,
    name: 'Настройки',
  },
  feedback: {
    path: '/feedback',
    component: Feedback,
    name: 'Обратная связь',
  },
  main: {
    path: '/',
  },
  notFound: {
    path: '*',
    component: NotFound,
  },
} as const;
