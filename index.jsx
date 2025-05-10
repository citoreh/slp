import React, { useState, useEffect } from 'react';
import { Sun, ArrowDown, Clipboard, Check } from 'lucide-react';

const StudioLightingConfigurator = () => {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    mainLight: {
      type: 'softbox',
      height: 200,
      angle: 45,
      intensity: 75,
      color: 5600,
      distance: 150
    },
    fillLight: {
      enabled: true,
      type: 'umbrella',
      height: 150,
      angle: 30,
      intensity: 40,
      color: 5600,
      distance: 180
    },
    rimLight: {
      enabled: true,
      height: 180,
      angle: 135,
      intensity: 60,
      color: 6000,
      distance: 120
    },
    background: {
      color: '#00b300',
      distance: 80
    }
  });

  // Generate prompt text based on the current configuration
  const generatePrompt = () => {
    let prompt = "Professional product photography setup with ";
    
    // Main light
    prompt += `a ${config.mainLight.intensity > 65 ? 'strong' : 'soft'} ${config.mainLight.type} as the key light positioned at ${config.mainLight.height}cm height, `;
    prompt += `${config.mainLight.angle}° angle, with ${config.mainLight.color}K color temperature, `;
    prompt += `${config.mainLight.distance}cm from subject. `;
    
    // Fill light
    if (config.fillLight.enabled) {
      prompt += `Fill light using ${config.fillLight.type} at ${config.fillLight.height}cm height, `;
      prompt += `${config.fillLight.angle}° angle, at ${config.fillLight.intensity}% intensity, `;
      prompt += `${config.fillLight.distance}cm from subject. `;
    }
    
    // Rim light
    if (config.rimLight.enabled) {
      prompt += `Rim light positioned at ${config.rimLight.height}cm height, `;
      prompt += `${config.rimLight.angle}° angle, at ${config.rimLight.intensity}% intensity, `;
      prompt += `${config.rimLight.color}K color temperature, ${config.rimLight.distance}cm from subject. `;
    }
    
    // Background
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(config.background.color);
    const greenShade = rgb.g > 200 ? 'bright' : rgb.g > 150 ? 'medium' : 'dark';
    
    prompt += `${greenShade} green backdrop positioned ${config.background.distance}cm behind subject.`;
    
    return prompt;
  };

  // Handle copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update a specific light parameter
  const updateLightConfig = (light, param, value) => {
    setConfig(prev => ({
      ...prev,
      [light]: {
        ...prev[light],
        [param]: value
      }
    }));
  };

  // Toggle a light on/off
  const toggleLight = (light) => {
    setConfig(prev => ({
      ...prev,
      [light]: {
        ...prev[light],
        enabled: !prev[light].enabled
      }
    }));
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto p-4 bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-4">Studio Lighting Configurator</h1>
      
      {/* Studio Preview */}
      <div className="relative w-full h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 rounded-lg" 
          style={{ 
            backgroundColor: config.background.color,
            transform: `translateZ(-${config.background.distance}px)`,
          }}
        />
        
        {/* Product placeholder */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-lg shadow-lg flex items-center justify-center">
          <span className="text-gray-500">Product</span>
        </div>
        
        {/* Main Light */}
        <div 
          className="absolute w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center shadow-lg"
          style={{
            top: `${100 - (config.mainLight.height / 3)}%`,
            left: `${50 + (Math.cos(config.mainLight.angle * Math.PI / 180) * config.mainLight.distance / 5)}%`,
            opacity: config.mainLight.intensity / 100,
            filter: `blur(${config.mainLight.type === 'softbox' ? 4 : 2}px)`
          }}
        >
          <Sun className="text-yellow-600" size={20} />
        </div>
        
        {/* Fill Light */}
        {config.fillLight.enabled && (
          <div 
            className="absolute w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center shadow-lg"
            style={{
              top: `${100 - (config.fillLight.height / 3)}%`,
              left: `${50 - (Math.cos(config.fillLight.angle * Math.PI / 180) * config.fillLight.distance / 5)}%`,
              opacity: config.fillLight.intensity / 100,
              filter: `blur(${config.fillLight.type === 'softbox' ? 4 : 2}px)`
            }}
          >
            <Sun className="text-yellow-500" size={16} />
          </div>
        )}
        
        {/* Rim Light */}
        {config.rimLight.enabled && (
          <div 
            className="absolute w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shadow-lg"
            style={{
              top: `${100 - (config.rimLight.height / 3)}%`,
              left: `${50 + (Math.cos(config.rimLight.angle * Math.PI / 180) * config.rimLight.distance / 5)}%`,
              opacity: config.rimLight.intensity / 100,
              filter: `blur(2px)`
            }}
          >
            <Sun className="text-blue-300" size={14} />
          </div>
        )}
        
        {/* Light direction indicators */}
        <ArrowDown 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-50"
          size={40}
          style={{
            transform: `translate(-50%, -50%) rotate(${config.mainLight.angle}deg)`,
            transformOrigin: 'center',
          }}
        />
      </div>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Light Controls */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold mb-3">Key Light</h2>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Type</label>
            <select 
              className="w-full p-2 border rounded"
              value={config.mainLight.type}
              onChange={(e) => updateLightConfig('mainLight', 'type', e.target.value)}
            >
              <option value="softbox">Softbox</option>
              <option value="umbrella">Umbrella</option>
              <option value="beauty dish">Beauty Dish</option>
              <option value="bare bulb">Bare Bulb</option>
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Height (cm): {config.mainLight.height}</label>
            <input 
              type="range" 
              min="50" 
              max="300" 
              className="w-full"
              value={config.mainLight.height}
              onChange={(e) => updateLightConfig('mainLight', 'height', parseInt(e.target.value))}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Angle (deg): {config.mainLight.angle}</label>
            <input 
              type="range" 
              min="0" 
              max="180" 
              className="w-full"
              value={config.mainLight.angle}
              onChange={(e) => updateLightConfig('mainLight', 'angle', parseInt(e.target.value))}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Intensity: {config.mainLight.intensity}%</label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              className="w-full"
              value={config.mainLight.intensity}
              onChange={(e) => updateLightConfig('mainLight', 'intensity', parseInt(e.target.value))}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Color Temp (K): {config.mainLight.color}</label>
            <input 
              type="range" 
              min="2700" 
              max="7500" 
              step="100"
              className="w-full"
              value={config.mainLight.color}
              onChange={(e) => updateLightConfig('mainLight', 'color', parseInt(e.target.value))}
            />
          </div>
          
          <div className="mb-3">
            <label className="block text-sm mb-1">Distance (cm): {config.mainLight.distance}</label>
            <input 
              type="range" 
              min="50" 
              max="250" 
              className="w-full"
              value={config.mainLight.distance}
              onChange={(e) => updateLightConfig('mainLight', 'distance', parseInt(e.target.value))}
            />
          </div>
        </div>
        
        {/* Fill Light Controls */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold">Fill Light</h2>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={config.fillLight.enabled}
                onChange={() => toggleLight('fillLight')}
              />
              <span className="ml-2 text-sm">Enabled</span>
            </label>
          </div>
          
          <div className={config.fillLight.enabled ? "" : "opacity-50 pointer-events-none"}>
            <div className="mb-3">
              <label className="block text-sm mb-1">Type</label>
              <select 
                className="w-full p-2 border rounded"
                value={config.fillLight.type}
                onChange={(e) => updateLightConfig('fillLight', 'type', e.target.value)}
                disabled={!config.fillLight.enabled}
              >
                <option value="softbox">Softbox</option>
                <option value="umbrella">Umbrella</option>
                <option value="reflector">Reflector</option>
                <option value="panel">LED Panel</option>
              </select>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Height (cm): {config.fillLight.height}</label>
              <input 
                type="range" 
                min="50" 
                max="300" 
                className="w-full"
                value={config.fillLight.height}
                onChange={(e) => updateLightConfig('fillLight', 'height', parseInt(e.target.value))}
                disabled={!config.fillLight.enabled}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Angle (deg): {config.fillLight.angle}</label>
              <input 
                type="range" 
                min="0" 
                max="180" 
                className="w-full"
                value={config.fillLight.angle}
                onChange={(e) => updateLightConfig('fillLight', 'angle', parseInt(e.target.value))}
                disabled={!config.fillLight.enabled}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Intensity: {config.fillLight.intensity}%</label>
              <input 
                type="range" 
                min="10" 
                max="100" 
                className="w-full"
                value={config.fillLight.intensity}
                onChange={(e) => updateLightConfig('fillLight', 'intensity', parseInt(e.target.value))}
                disabled={!config.fillLight.enabled}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Color Temp (K): {config.fillLight.color}</label>
              <input 
                type="range" 
                min="2700" 
                max="7500" 
                step="100"
                className="w-full"
                value={config.fillLight.color}
                onChange={(e) => updateLightConfig('fillLight', 'color', parseInt(e.target.value))}
                disabled={!config.fillLight.enabled}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Distance (cm): {config.fillLight.distance}</label>
              <input 
                type="range" 
                min="50" 
                max="250" 
                className="w-full"
                value={config.fillLight.distance}
                onChange={(e) => updateLightConfig('fillLight', 'distance', parseInt(e.target.value))}
                disabled={!config.fillLight.enabled}
              />
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Rim Light Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold">Rim Light</h2>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-blue-600"
                  checked={config.rimLight.enabled}
                  onChange={() => toggleLight('rimLight')}
                />
                <span className="ml-2 text-sm">Enabled</span>
              </label>
            </div>
            
            <div className={config.rimLight.enabled ? "" : "opacity-50 pointer-events-none"}>
              <div className="mb-3">
                <label className="block text-sm mb-1">Height (cm): {config.rimLight.height}</label>
                <input 
                  type="range" 
                  min="50" 
                  max="300" 
                  className="w-full"
                  value={config.rimLight.height}
                  onChange={(e) => updateLightConfig('rimLight', 'height', parseInt(e.target.value))}
                  disabled={!config.rimLight.enabled}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Angle (deg): {config.rimLight.angle}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="180" 
                  className="w-full"
                  value={config.rimLight.angle}
                  onChange={(e) => updateLightConfig('rimLight', 'angle', parseInt(e.target.value))}
                  disabled={!config.rimLight.enabled}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Intensity: {config.rimLight.intensity}%</label>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  className="w-full"
                  value={config.rimLight.intensity}
                  onChange={(e) => updateLightConfig('rimLight', 'intensity', parseInt(e.target.value))}
                  disabled={!config.rimLight.enabled}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Color Temp (K): {config.rimLight.color}</label>
                <input 
                  type="range" 
                  min="2700" 
                  max="7500" 
                  step="100"
                  className="w-full"
                  value={config.rimLight.color}
                  onChange={(e) => updateLightConfig('rimLight', 'color', parseInt(e.target.value))}
                  disabled={!config.rimLight.enabled}
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Distance (cm): {config.rimLight.distance}</label>
                <input 
                  type="range" 
                  min="50" 
                  max="250" 
                  className="w-full"
                  value={config.rimLight.distance}
                  onChange={(e) => updateLightConfig('rimLight', 'distance', parseInt(e.target.value))}
                  disabled={!config.rimLight.enabled}
                />
              </div>
            </div>
          </div>
          
          {/* Background Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold mb-3">Background</h2>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Color</label>
              <input 
                type="color" 
                className="w-full h-10"
                value={config.background.color}
                onChange={(e) => updateLightConfig('background', 'color', e.target.value)}
              />
            </div>
            
            <div className="mb-3">
              <label className="block text-sm mb-1">Distance (cm): {config.background.distance}</label>
              <input 
                type="range" 
                min="20" 
                max="200" 
                className="w-full"
                value={config.background.distance}
                onChange={(e) => updateLightConfig('background', 'distance', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Generated Prompt */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-bold">Generated Prompt for Text-to-Image AI</h2>
          <button 
            className="flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={copyToClipboard}
          >
            {copied ? <Check size={16} className="mr-1" /> : <Clipboard size={16} className="mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="p-3 bg-gray-100 rounded text-sm whitespace-pre-wrap">
          {generatePrompt()}
        </div>
      </div>
    </div>
  );
};

export default StudioLightingConfigurator;
