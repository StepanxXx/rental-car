import { Blocks } from 'react-loader-spinner';
import { createPortal } from 'react-dom';
import css from './Loader.module.css';

export default function Loader() {
  return createPortal(
    <div className={css.loader}>
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
      />
    </div>,
    document.body
  );
}
