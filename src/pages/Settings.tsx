import { useSettingsStore } from '../stores/settingsStore';
import { Smartphone, Palette, Vibrate, Volume2, Zap, Eye, Info } from 'lucide-react';
import type { Theme, AccentColor } from '../types';

const ACCENT_COLORS: { value: AccentColor; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: '#2563eb' },
  { value: 'green', label: 'Green', color: '#10b981' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
  { value: 'amber', label: 'Amber', color: '#f59e0b' },
];

export function Settings() {
  const {
    theme,
    accentColor,
    haptics,
    sound,
    reducedMotion,
    keepAwake,
    setTheme,
    setAccentColor,
    setHaptics,
    setSound,
    setReducedMotion,
    setKeepAwake,
  } = useSettingsStore();

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Appearance */}
        <section className="bg-surface border-2 border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </h2>

          <div className="space-y-6">
            {/* Theme */}
            <div>
              <label className="block text-sm font-medium mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {(['system', 'light', 'dark'] as Theme[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`p-3 rounded-lg border-2 transition-all capitalize ${
                      theme === t
                        ? 'border-primary bg-primary/10 font-bold'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium mb-3">Accent Color</label>
              <div className="grid grid-cols-4 gap-3">
                {ACCENT_COLORS.map((accent) => (
                  <button
                    key={accent.value}
                    onClick={() => setAccentColor(accent.value)}
                    className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      accentColor === accent.value
                        ? 'border-primary bg-primary/10 font-bold'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: accent.color }}
                    />
                    <span className="text-xs">{accent.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section className="bg-surface border-2 border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Accessibility
          </h2>

          <div className="space-y-4">
            <SettingToggle
              icon={<Zap className="w-5 h-5" />}
              label="Reduced Motion"
              description="Minimize animations and transitions"
              checked={reducedMotion}
              onChange={setReducedMotion}
            />
          </div>
        </section>

        {/* Feedback */}
        <section className="bg-surface border-2 border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Vibrate className="w-5 h-5" />
            Feedback
          </h2>

          <div className="space-y-4">
            <SettingToggle
              icon={<Vibrate className="w-5 h-5" />}
              label="Haptic Feedback"
              description="Vibrate on interactions"
              checked={haptics}
              onChange={setHaptics}
            />

            <SettingToggle
              icon={<Volume2 className="w-5 h-5" />}
              label="Sound Effects"
              description="Play sounds for events"
              checked={sound}
              onChange={setSound}
            />
          </div>
        </section>

        {/* Device */}
        <section className="bg-surface border-2 border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Device
          </h2>

          <div className="space-y-4">
            <SettingToggle
              icon={<Smartphone className="w-5 h-5" />}
              label="Keep Screen Awake"
              description="Prevent screen from dimming during timer/arena"
              checked={keepAwake}
              onChange={setKeepAwake}
            />
          </div>
        </section>

        {/* About */}
        <section className="bg-surface border-2 border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">App Name</span>
              <span className="font-medium">PlayFlow</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Type</span>
              <span className="font-medium">Progressive Web App</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Offline Mode</span>
              <span className="font-medium text-primary">✓ Enabled</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t-2 border-border">
            <p className="text-xs text-text-secondary text-center">
              Built for board game enthusiasts
              <br />
              All data stored locally on your device
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

interface SettingToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function SettingToggle({ icon, label, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-text-secondary mt-1">{icon}</div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <div
          className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}
