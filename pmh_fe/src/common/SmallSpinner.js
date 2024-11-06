const Spinner = ({ hideColor = false, customSpinnerClass }) => {
  return (
    <div className={`text-center${hideColor ? '' : ' text-primary'}`}>
      <div
        style={{ height: '20px', width: '20px' }}
        className={`spinner-border${
          customSpinnerClass ? ` ${customSpinnerClass}` : ''
        }`}
        role='status'
        aria-hidden='true'
      ></div>
    </div>
  );
};

export default Spinner;
