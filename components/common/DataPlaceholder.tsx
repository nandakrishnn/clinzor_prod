// components/DataPlaceholder.tsx
import React from "react";
import { FiDatabase } from "react-icons/fi"; // Using Feather Icons

interface DataPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg"; // Added size prop for different scenarios
}

const DataPlaceholder: React.FC<DataPlaceholderProps> = ({
  title = "No data available",
  description = "There's no data to display at the moment.",
  icon = null,
  action = null,
  className = "",
  size = "md",
}) => {
  // Default icon if none provided
  const defaultIcon = (
    <FiDatabase
      className={
        size === "sm" ? "text-2xl" : size === "lg" ? "text-5xl" : "text-4xl"
      }
    />
  );

  // Size-based text classes
  const titleClass =
    size === "sm" ? "text-md" : size === "lg" ? "text-xl" : "text-lg";

  const descriptionClass =
    size === "sm" ? "text-sm" : size === "lg" ? "text-md" : "text-base";

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div
        className={`mb-4 text-gray-400 ${size === "lg" ? "p-3 bg-gray-100 rounded-full" : ""
          }`}
      >
        {icon || defaultIcon}
      </div>
      <h3 className={`font-medium text-gray-700 mb-2 ${titleClass}`}>
        {title}
      </h3>
      <p className={`text-gray-500 mb-4 max-w-md ${descriptionClass}`}>
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default DataPlaceholder;
