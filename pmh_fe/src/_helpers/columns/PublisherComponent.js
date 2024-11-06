import { React, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageByName } from '_services/file';
import { PUBLICURL } from '_helpers/Utils/dashboardUtil';
import Spinner from 'common/SmallSpinner';

const PublisherComponent = ({ platformInfo, styles, showNull, value }) => {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState(null);
  const [isImageFetched, setIsImageFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const capitalizeBeforeDot = (str) => {
    if (!str) return '';
    const trimmedString = str.split('.')[0];
    return trimmedString.charAt(0).match(/[a-zA-Z]/)
      ? trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1)
      : trimmedString;
  }

  useEffect(() => {
    let objectUrl = null;

    const fetchImage = async () => {
      setIsLoading(true);
      try {
        if(value) {
          const response = await getImageByName(value);
          if (response) {
            objectUrl = response;
            setImageUrl(objectUrl);
          } else {
            setImageUrl(null);
          }
        }
      } catch (error) {
        setImageUrl(null);
      } finally {
        setIsImageFetched(true);
        setIsLoading(false);
      }
    };

    if (!platformInfo) {
      fetchImage();
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setIsImageFetched(false);
        setImageUrl(null);
      }
    };
  }, [platformInfo, value]);

  if (!platformInfo && isImageFetched && !imageUrl) {
    return showNull;
  }

  return (
    <span className="publisher-text">
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <img
            src={imageUrl ? imageUrl : `${window.location.origin}${PUBLICURL}/assets/icons/${platformInfo?.icon}`}
            className={styles['table-publisher-icon']}
            alt={platformInfo?.name || value}
          />
          <span style={{ padding: '0.25rem' }}>
            {platformInfo?.name
              ? t(`site_titles.${platformInfo.name}`)
              : capitalizeBeforeDot(value)
            }
          </span>
        </>
      )}
    </span>
  );
};

export default PublisherComponent;
