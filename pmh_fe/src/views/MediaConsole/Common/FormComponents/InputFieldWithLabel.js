import './InputFieldWithLabel.scss';

const InputFieldWithLabel = ({
  label = 'Label',
  value = '',
  onChange = () => {},
  errorMsg,
  isInvalid = false,
  disabled = false,
  onClick = () => {},
  maxLength,
  min,
  placeholder = 'Enter',
  type = 'text',
  showAsterisk = false,
}) => {
  return (
    <div className='input-field-container w-100 position-relative'>
      <label className={`form-label ${isInvalid ? 'error-color' : ''}`}>
        {label}
        {showAsterisk && <span className='error-color'>{` *`}</span>}
      </label>

      <input
        type={type}
        className={`form-control ${isInvalid ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        onClick={onClick}
        maxLength={maxLength}
        min={min}
        title=''
      />

      {isInvalid && <div className='helper-text-container'>{errorMsg}</div>}
    </div>
  );
};

export default InputFieldWithLabel;
