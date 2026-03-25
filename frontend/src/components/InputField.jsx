import React from "react";
import { X } from "lucide-react";
import "./InputField.css";

const InputField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onClear,
  icon: Icon,
  type = "text",
  disabled = false,
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
        </label>
      )}
      <div className={`input-wrapper ${disabled ? "disabled" : ""}`}>
        {Icon && (
          <span className="input-icon">
            <Icon size={18} />
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${Icon ? "has-icon" : ""} ${onClear && value ? "has-clear" : ""}`}
          autoComplete="off"
        />
        {onClear && value && !disabled && (
          <button type="button" className="input-clear-btn" onClick={onClear}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
