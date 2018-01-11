/**
 *
 * Asynchronously loads the component for PercentageSlider
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
