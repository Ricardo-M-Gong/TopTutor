"use client";

interface Props {
  value: string[];
  onChange: (regions: string[]) => void;
  options: readonly string[];
}

export default function RegionMultiSelect({ value, onChange, options }: Props) {
  function toggle(region: string) {
    onChange(value.includes(region) ? value.filter((r) => r !== region) : [...value, region]);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((region) => (
        <button
          key={region}
          type="button"
          onClick={() => toggle(region)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            value.includes(region)
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
}
