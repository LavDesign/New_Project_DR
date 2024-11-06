import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { useTranslation } from 'react-i18next';
import CommonHeader from '../CommonHeader';
import './Header.scss';
import useOutsideClick from 'views/shared/useOutsideClick';
import { useStore } from '_helpers/storeContext';

const Header = ({ hideLinks }) => {
  const { store } = useStore();
  const currentUser = store?.currentUser;

  //campaigns tab will be visible only to demo users temporarily
  const isDemoUser = currentUser?.userAbilitiesList.find((x) => x.abilityId === 4);

  const { t } = useTranslation(['common']);
  const navMenuLinks = hideLinks
    ? [
        {
          path: '/access-request-form',
          text: t('master_page.header.links.access_request_title'),
          value: 'accessRequestForm',
        },
      ]
    : [
        // Home link is commented until page is created.
        /*{
      path: '/home',
      text: t('master_page.header.links.home'),
      value: 'home',
    }*/
        {
          path: '/daily-review',
          text: t('master_page.header.links.daily_review'),
          value: 'dailyReview',
          subMenuLinks: [
            {
              path: '/budget-recommendation',
              text: t('header_names.budget_recommendation'),
              value: 'dailyReview',
            },
            {
              path: '/campaign-advisor',
              text: t('header_names.campaign_advisor'),
              value: 'dailyReview',
            },
          ],
        },
        {
          path: '/dashboard',
          text: t('master_page.header.links.dashboard'),
          value: 'dashboard',
        },
        {
          path: '/strategy-tools',
          text: t('master_page.header.links.strategy_tools'),
          value: 'strategyTools',
          subMenuLinks: [
            {
              path: '/budget-grouping',
              text: t('master_page.header.links.budget_grouping'),
              value: 'strategyTools',
            },
          ],
        },
        {
          path: '/platform-menu',
          text: t('master_page.header.links.platform'),
          value: 'platformMenu',
          subMenuLinks: [
            {
              path: '/management',
              text: t('master_page.header.links.management'),
              value: 'platformMenu',
            },
            {
              path: '/platform-auth',
              text: t('master_page.header.links.authentication'),
              value: 'platformMenu',
            },
          ],
        },
        ...(isDemoUser ? [
          {
            path: '/campaigns',
            text: t('master_page.header.links.campaigns'),
            value: 'campaigns',
          }
        ] : [])
      ];

  const getUserMenuLink = () => {
    const userMenuList = ['/user-management', '/user-settings'];
    if (userMenuList.some((link) => location.pathname.includes(link)))
      return 'platformMenu';
    return '';
  };

  const activeSubAndUserMenuLinks = () => {
    const getSubMenuLink = navMenuLinks.find((link) =>
      link.subMenuLinks?.some((subLink) =>
        location.pathname.includes(subLink.path)
      )
    );
    return getSubMenuLink ? getSubMenuLink?.value : getUserMenuLink();
  };

  const getActivePath = () =>
    navMenuLinks.find((link) => location.pathname.includes(link.path));

  const initialActiveLink = () => {
    const activeNavMenuLink = getActivePath();
    if (activeNavMenuLink) return activeNavMenuLink.value;
    return activeSubAndUserMenuLinks();
  };

  const [selectedMenu, setSelectedMenu] = useState(initialActiveLink());
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const subMenuRef = useRef(null); // Create a ref for each submenu
  const navigate = useNavigate();

  const handleLinkSelection = (navMenu) =>
    !navMenu?.subMenuLinks && setSelectedMenu(navMenu.value);

  const onHeaderClick = () => {
    navigate('/daily-review');
    setSelectedMenu('dailyReview');
  };

  useOutsideClick(subMenuRef, () => setOpenSubMenu(null));

  return (
    <header className='master-header'>
      <img
        src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_header.png`}
        className='groove_header_image'
        alt=''
      />
      <CommonHeader onHeaderClick={onHeaderClick} hideLinks={hideLinks} />

      <div className='mt-0 d-flex justify-content-start link-container'>
        {navMenuLinks.map((link, index) => {
          const hasSubMenu = !!link.subMenuLinks;

          const handleSubMenuClick = (e) => {
            e.stopPropagation();
            setOpenSubMenu(openSubMenu === link.value ? null : link.value);
          };

          if (hasSubMenu) {
            return (
              <div
                className='position-relative'
                id={`custom-menu-${link.value}-id`}
                key={index}
              >
                <div
                  className='d-flex align-items-center position-relative'
                  onClick={handleSubMenuClick}
                >
                  <Link
                    to={getActivePath()?.path}
                    className={`link-group text-nowrap ${
                      selectedMenu === link.value ? 'selected' : ''
                    }`}
                    onClick={() => handleLinkSelection(link)}
                  >
                    {link.text}
                    {selectedMenu === link.value && (
                      <div className='selected-bar'></div>
                    )}
                  </Link>
                  <img
                    src={`${window.location.origin}${PUBLICURL}/assets/icons/arrow-white.svg`}
                    className={`sub-menu-arrow`}
                    alt='Arrow Icon'
                  />
                </div>
                {openSubMenu === link.value && (
                  <div className='sub-menu' ref={subMenuRef}>
                    {link.subMenuLinks.map((subLink, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subLink.path}
                        className='link-group text-nowrap'
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLinkSelection(subLink);
                          setOpenSubMenu(null);
                        }}
                      >
                        {subLink.text}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={index}
              to={link.path}
              className={`link-group text-nowrap ${
                selectedMenu === link.value ? 'selected' : ''
              }`}
              onClick={() => handleLinkSelection(link)}
              style={{
                cursor: hideLinks ? 'auto' : 'pointer',
              }}
            >
              {link.text}
              {selectedMenu === link.value && (
                <div className='selected-bar'></div>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
