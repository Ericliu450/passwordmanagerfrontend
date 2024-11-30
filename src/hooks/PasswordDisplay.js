import React, { useState } from 'react';
import { Eye, EyeOff, Copy, CheckSquare } from 'lucide-react';

function PasswordDisplay({ password, strength, onCopy }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (onCopy) {
      await onCopy();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthLabels = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          value={password}
          readOnly
          className="w-full p-3 bg-gray-50 border rounded-lg font-mono text-lg"
          placeholder="Generated password"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
          {password && (
            <>
              <button
                onClick={() => setVisible(!visible)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {visible ? <EyeOff /> : <Eye />}
              </button>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? <CheckSquare className="text-green-500" /> : <Copy />}
              </button>
            </>
          )}
        </div>
      </div>

      {password && (
        <div className="space-y-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < strength ? strengthColors[strength - 1] : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">
            Strength: {strengthLabels[strength - 1] || 'Very Weak'}
          </p>
        </div>
      )}
    </div>
  );
}

export default PasswordDisplay;