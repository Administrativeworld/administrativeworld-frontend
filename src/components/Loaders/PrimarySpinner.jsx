import PropTypes from 'prop-types';

function PrimarySpinner({ secondaryColor = "secondary" }) {
  const spinnerStyle = {
    '--primary-color': `hsl(var(--${secondaryColor}))`,
    '--secondary-color': `hsl(var(--${secondaryColor}))`,
  };

  return (
    <div className=" " style={spinnerStyle}>
      <div className="spinner"></div>
    </div>
  );
}

PrimarySpinner.propTypes = {
  primaryColor: PropTypes.string,
  secondaryColor: PropTypes.string,
};

export default PrimarySpinner;
