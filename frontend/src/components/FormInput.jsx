import PropTypes from "prop-types";

import { Input, Typography } from "@material-tailwind/react";

export const FormInput = ({ label, name, placeholder, type="string", value, handleChange, error, icon }) => {
  return (
    <div>
      <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
        {label}
      </Typography>
      <Input
        size="lg"
        placeholder={placeholder}
        className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
        labelProps={{ className: "before:content-none after:content-none" }}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        icon={icon}
        error={error.length > 0}
      />
      {error.length > 0 && (
        <Typography variant="small" color="red" className="text-left">
          {error}
        </Typography>
      )}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  icon: PropTypes.element,
}
