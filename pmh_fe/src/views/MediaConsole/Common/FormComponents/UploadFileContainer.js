import "./UploadFileContainer.scss";
import { PUBLICURL } from "_helpers/Utils/dashboardUtil";
import { useTranslation } from 'react-i18next';
import React from "react";

const UploadFileContainer = ({ limitText, selectedFile, setSelectedFile, handleRemoveFile, filePresent }) => {
  const { t } = useTranslation(['common']);
  const isFilePresent = filePresent();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  return (
    <React.Fragment>
      <div className="dashed-container" onDragOver={handleDragOver} onDrop={handleDrop}>
        <div className="internal-rectangle"></div>
        <div className="upload-section">
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/upload-file.svg`}
            alt="upload"
            className="upload-icon"
          />
          <div>
            <span className="upload-text">{t('upload_file.attach_files')}</span>
            <label htmlFor="file-upload" className="browse-text">
              {t('upload_file.browse')}
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="limit-section">
              <span className="limit-text">{limitText}</span>
            </div>
          </div>
        </div>

        <div className="folder-section">
          <img
            src={`${window.location.origin}${PUBLICURL}/assets/icons/folder-file.svg`}
            alt="folder"
          />
        </div>
      </div>

      {(selectedFile || isFilePresent) && (
        <div className="selected-file-section">
          <p className="file-text">
            {selectedFile
              ? `${t('upload_file.selected_file')} ${selectedFile.name}`
              : `${t('upload_file.current_file')} ${isFilePresent}`
            }
          </p>
          {(isFilePresent && !selectedFile) && (
          <div className="remove-file" onClick={() => handleRemoveFile(true, isFilePresent)}>
            <img src={`${window.location.origin}${PUBLICURL}/assets/icons/groove_remove_icon.png`}
              alt="Remove" className="remove-icon" />
            <p className="file-text">{t('upload_file.remove_image')}</p>
          </div>
          )}
        </div>
      )}
    </React.Fragment>
  );

};






export default UploadFileContainer;