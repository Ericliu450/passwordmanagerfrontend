import React from 'react';

function GeneratorControls({ length, options, onLengthChange, onOptionsChange }) {
  const handleOptionChange = (key) => (e) => {
    onOptionsChange({ ...options, [key]: e.target.checked });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium">
          Length: {length} characters
        </label>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => onLengthChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div className="space-y-3">
        {[
          { key: 'includeUppercase', label: 'Include uppercase letters' },
          { key: 'includeLowercase', label: 'Include lowercase letters' },
          { key: 'includeNumbers', label: 'Include numbers' },
          { key: 'includeSymbols', label: 'Include symbols' }
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options[key]}
              onChange={handleOptionChange(key)}
              className="w-4 h-4"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default GeneratorControls;