import { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../_theme/modules/UI/NavBarMenu.module.css';
import Backdrop from './Backdrop';
import { PUBLICURL } from '../../_helpers/Utils/dashboardUtil';

const NavBarMenu = ({
  name,
  onLogoutHandler,
  pages = [],
  mediaIcon = true,
  showName = true,
  isMediaConsole = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClickMenu = () => setIsOpen((prevState) => !prevState);
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <Backdrop onClick={onClickMenu} />}

      {mediaIcon && (
        <div
          style={{ marginRight: '30px', marginTop: '10px' }}
          className={`btn-group align-items-center ${styles['menu-with-separator']}`}
          onClick={() => navigate('/daily-review')}
        >
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/groove-report-icon.svg`}
            style={{ width: '20px', height: '20px' }}
            alt=''
          />
          <span className='ms-2'>Media Console</span>
        </div>
      )}

      <div
        style={
          !isMediaConsole ? { marginRight: '15px', marginTop: '10px' } : {}
        }
        className={`btn-group align-items-center`}
      >
        <img
          src={`${window.location.origin}${PUBLICURL}/assets/icons/groove-user.png`}
          onClick={onClickMenu}
          style={{ width: '20px', height: '20px' }}
          alt=''
        />

        {showName && name?.split(',')[1] && (
          <span
            className={`${styles['groove_user_name']}`}
            tabIndex='0'
            onClick={onClickMenu}
            aria-label={name + 'user'}
          >
            {name?.split(',')[1]}
          </span>
        )}
        <ul
          className={`dropdown-menu dropdown-menu-lg-end ${
            isOpen ? 'show' : ''
          } ${styles.menu}`}
          data-bs-popper='static'
        >
          <li>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/groove-menu-user.svg`}
              onClick={onClickMenu}
              style={{
                marginTop: '18px',
                marginLeft: '36%',
                width: '48px',
                height: '48px',
              }}
            />
          </li>
          <li style={{ marginTop: '11px', textAlign: 'center' }}>
            <span
              className={`${styles['groove_menu_user_name']}`}
              tabIndex='0'
              aria-label={name + 'user'}
            >
              {' '}
              {name}
            </span>
          </li>

          <li>
            <img
              src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_line.png`}
              style={{
                marginTop: '19px',
                marginBottom: '4px',
                marginLeft: '-9px',
              }}
            />
          </li>
          {pages.map((page, idx) => (
            <Fragment key={`navbar-${page.url}`}>
              <li
                className={`${styles['groove_menu_items']}`}
                key={idx}
                hidden={page.hidden}
              >
                <Link
                  className={` dropdown-item ${styles['groove_menu_items_link']}`}
                  to={page.url}
                  onClick={onClickMenu}
                >
                  {page.name}
                </Link>
              </li>
              <li>
                <img
                  src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_line.png`}
                  style={{ marginLeft: '-9px' }}
                />
              </li>
            </Fragment>
          ))}
          <li
            className={`${styles['groove_menu_items']} ${styles['menu-logout']}`}
          >
            <div
              style={{ marginLeft: '-9px' }}
              className={`dropdown-item  mb-0 ${styles['groove_menu_items_link']}`}
              onClick={onLogoutHandler}
            >
              <p className='mb-0'>Logout</p>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
};

export default NavBarMenu;
