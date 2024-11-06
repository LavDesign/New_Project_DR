import { useRouteError } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import Forbidden from '../Forbidden/Forbidden';

const ErrorBoundary = props => {
  let error = useRouteError();
  console.error("ERROR: ", error);

  if (error && error.code === 'ERR_BAD_REQUEST') {
    return <Forbidden />
  }

  return <NotFound />
};

export default ErrorBoundary;