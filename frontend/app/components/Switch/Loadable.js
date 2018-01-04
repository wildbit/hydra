/**
 *
 * Asynchronously loads the component for Toggle
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
