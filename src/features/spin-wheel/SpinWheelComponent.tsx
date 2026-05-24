import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, X, Save, List, Trash2 } from 'lucide-react';
import { useSpinWheelStore } from '../../stores/spinWheelStore';

const COLORS = [
  '#2563eb', '#dc2626', '#16a34a', '#f59e0b',
  '#a855f7', '#14b8a6', '#f97316', '#ec4899',
];

export function SpinWheel() {
  const {
    segments,
    isSpinning,
    winner,
    rotation,
    presets,
    setSegments,
    spin,
    reset,
    savePreset,
    loadPreset,
    deletePreset,
  } = useSpinWheelStore();

  const [editMode, setEditMode] = useState(false);
  const [editSegments, setEditSegments] = useState(segments);
  const [showPresets, setShowPresets] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleSaveSegments = () => {
    setSegments(editSegments);
    setEditMode(false);
  };

  const handleAddSegment = () => {
    if (editSegments.length < 20) {
      setEditSegments([...editSegments, `Option ${editSegments.length + 1}`]);
    }
  };

  const handleRemoveSegment = (index: number) => {
    if (editSegments.length > 2) {
      setEditSegments(editSegments.filter((_, i) => i !== index));
    }
  };

  const handleUpdateSegment = (index: number, value: string) => {
    const updated = [...editSegments];
    updated[index] = value;
    setEditSegments(updated);
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      savePreset(presetName);
      setPresetName('');
    }
  };

  // Edit Mode View
  if (editMode) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit Segments</h1>
          <button
            onClick={handleSaveSegments}
            className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            Save
          </button>
        </div>

        <div className="max-w-md mx-auto space-y-3">
          {editSegments.map((segment, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={segment}
                onChange={(e) => handleUpdateSegment(index, e.target.value)}
                className="flex-1 p-3 bg-surface border-2 border-border rounded-lg focus:outline-none focus:border-primary"
                placeholder={`Segment ${index + 1}`}
              />
              {editSegments.length > 2 && (
                <button
                  onClick={() => handleRemoveSegment(index)}
                  className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 active:scale-95 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          {editSegments.length < 20 && (
            <button
              onClick={handleAddSegment}
              className="w-full p-3 bg-surface border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Segment
            </button>
          )}
        </div>
      </div>
    );
  }

  // Presets View
  if (showPresets) {
    return (
      <div className="container mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Presets</h1>
          <button
            onClick={() => setShowPresets(false)}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          {/* Save Current */}
          <div className="bg-surface border-2 border-border rounded-xl p-4">
            <h3 className="font-medium mb-3">Save Current Wheel</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
                className="flex-1 p-2 bg-background border-2 border-border rounded-lg focus:outline-none focus:border-primary"
              />
              <button
                onClick={handleSavePreset}
                disabled={!presetName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Preset List */}
          {presets.length > 0 ? (
            <div className="space-y-2">
              {presets.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-surface border-2 border-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{preset.name}</h4>
                    <p className="text-sm text-text-secondary">
                      {preset.segments.length} segments
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        loadPreset(preset.id);
                        setShowPresets(false);
                      }}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deletePreset(preset.id)}
                      className="p-2 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary">
              <List className="w-12 h-12 mx-auto mb-2" />
              <p>No saved presets</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main Wheel View
  const degreesPerSegment = 360 / segments.length;

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-center">Spin Wheel</h1>

      <div className="max-w-2xl mx-auto">
        {/* Wheel */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
            <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-primary" />
          </div>

          {/* SVG Wheel */}
          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="w-80 h-80"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {segments.map((segment, index) => {
                const startAngle = index * degreesPerSegment;
                const endAngle = startAngle + degreesPerSegment;
                const largeArc = degreesPerSegment > 180 ? 1 : 0;

                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);

                const x1 = 100 + 90 * Math.cos(startRad);
                const y1 = 100 + 90 * Math.sin(startRad);
                const x2 = 100 + 90 * Math.cos(endRad);
                const y2 = 100 + 90 * Math.sin(endRad);

                const path = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;

                const midAngle = (startAngle + endAngle) / 2;
                const textAngle = midAngle;
                const textRad = (textAngle - 90) * (Math.PI / 180);
                const textX = 100 + 60 * Math.cos(textRad);
                const textY = 100 + 60 * Math.sin(textRad);

                return (
                  <g key={index}>
                    <path
                      d={path}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                    <text
                      x={textX}
                      y={textY}
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    >
                      {segment.length > 12 ? segment.slice(0, 10) + '...' : segment}
                    </text>
                  </g>
                );
              })}
              {/* Center Circle */}
              <circle cx="100" cy="100" r="15" fill="white" stroke="#333" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        {/* Winner Display */}
        <AnimatePresence>
          {winner && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="text-center mb-6"
            >
              <p className="text-lg text-text-secondary mb-2">Winner</p>
              <p className="text-4xl font-bold text-primary">{winner}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditSegments(segments);
              setEditMode(true);
            }}
            className="flex-1 bg-surface border-2 border-border py-3 px-6 rounded-xl font-bold hover:bg-background active:scale-95 transition-all"
          >
            Edit Segments
          </button>
          <button
            onClick={() => setShowPresets(true)}
            className="bg-surface border-2 border-border p-3 rounded-xl hover:bg-background active:scale-95 transition-all"
          >
            <List className="w-6 h-6" />
          </button>
        </div>

        <button
          onClick={() => {
            if (winner) reset();
            spin();
          }}
          disabled={isSpinning}
          className="w-full mt-3 bg-primary text-white py-4 px-6 rounded-xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Play className="w-6 h-6" />
          {isSpinning ? 'Spinning...' : winner ? 'Spin Again' : 'Spin Wheel'}
        </button>
      </div>
    </div>
  );
}
