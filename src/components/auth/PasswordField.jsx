import { useState } from "react";

const PasswordField = ({
  id,
  label,
  autoComplete,
  value,
  onChange,
  required = true,
  minLength,
  maxLength = 72,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <label htmlFor={id} className="block text-sm font-semibold text-[#29483f]">
      {label}
      <span className="relative mt-1.5 block">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-xl border border-[#d9d4c7] bg-white px-3.5 py-2 pr-16 font-normal text-[#203832] outline-none transition placeholder:text-[#9aa398] focus:border-[#63824d] focus:ring-2 focus:ring-[#e4efda]"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={`${isVisible ? "Hide" : "Show"} ${label.toLowerCase()}`}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-2 my-auto rounded-lg px-2 text-xs font-semibold text-[#527f69] hover:bg-[#f3f6e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#63824d]"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
};

export default PasswordField;
