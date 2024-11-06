import { createBrowserHistory } from 'history';
 
const history = createBrowserHistory({ basename: import.meta.env.VITE_PUBLIC_URL === '/' ? '': import.meta.env.VITE_PUBLIC_URL });

export { history };