import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import { useTranslation } from 'react-i18next';
import CommonHeader from '../CommonHeader';
import './SecondaryHeader.scss';

const SecondaryHeader = () => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const navigate = useNavigate();
  const { editGroupData } = useSelector((store) => store.getMediaConsole);

  const initialNavMenuLinks = location?.pathname.includes('new-edit-campaign')
    ? [
        {
          path: '/new-edit-campaign',
          text: t('master_page.header.links.new_campaign'),
          value: 'newEditCampaign',
        },
      ]
    : location?.pathname.includes('budget-group-details')
    ? [
        {
          path: '/budget-group-details',
          text: t('master_page.header.links.budget_group_details'),
          value: 'budgetGroupDetails',
        },
      ]
    : location?.pathname.includes('/new-edit-budget-group')
    ? [
        {
          path: '/new-edit-budget-group',
          text: t('master_page.header.links.new_group'),
          value: 'newEditBudgetGroup',
        },
      ]
    : [];

  const [navMenuLinks, setNavMenuLinks] = useState(initialNavMenuLinks);

  const getActivePath = () =>
    navMenuLinks.find((link) => location?.pathname.includes(link.path));

  const initialActiveLink = () => {
    const activeNavMenuLink = getActivePath();
    return activeNavMenuLink ? activeNavMenuLink.path : '/';
  };

  const [selectedLink, setSelectedLink] = useState(initialActiveLink());

  useEffect(() => {
    setSelectedLink(location?.pathname);
    const updateNavLinks = initialNavMenuLinks.map((link) => {
      if (editGroupData && location?.pathname === '/new-edit-budget-group')
        return {
          ...link,
          text: t('master_page.header.links.edit_group'),
        };
      else if (location?.pathname === '/new-edit-campaign')
        return {
          ...link,
          text: t('master_page.header.links.new_campaign'),
        };
      else if (location?.pathname === '/budget-group-details')
        return {
          ...link,
          text: t('master_page.header.links.budget_group_details'),
        };

      return link;
    });
    setNavMenuLinks(updateNavLinks);
  }, [location]);

  const onHeaderClick = () => {
    navigate('/daily-review');
    setSelectedLink('/daily-review');
  };

  return (
    <header className={`master-header-secondary`}>
      <img
        src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_header.png`}
        className={`groove_header_image header-image-container-secondary`}
        alt=''
      />
      <CommonHeader onHeaderClick={onHeaderClick} />
      <div
        className={`mt-0 d-flex justify-content-start link-container-secondary`}
      >
        {navMenuLinks.map((link, index) => {
          return (
            <Link
              key={index}
              to={link.path}
              className={`link-group-secondary text-nowrap ${
                selectedLink === link.path ? 'selected' : ''
              }`}
              onClick={() => setSelectedLink(link.path)}
              style={{ opacity: selectedLink === link.path ? '1' : '0.7' }}
            >
              {link.text}
              {selectedLink === link.path && (
                <div className={`selected-bar-secondary`}></div>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
};

export default SecondaryHeader;
