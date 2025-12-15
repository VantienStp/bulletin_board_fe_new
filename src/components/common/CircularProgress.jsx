export default function CircularProgress({ value = 0, size = 16, stroke = 3 }) {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference - (value / 100) * circumference;

    const getColor = () => {
        if (value === 0) return "#cccccc";
        if (value <= 25) return "#e67e22";
        if (value <= 50) return "#f5a623";
        if (value <= 75) return "#f1c40f";
        if (value < 100) return "#27ae60";
        return "#2ecc71";
    };

    const barColor = getColor();

    return (
        <div className="relative flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    stroke="#f6eddc"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={barColor}
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeDasharray={circumference}
                    strokeDashoffset={progress}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>

            <span
                className="absolute text-xs font-semibold"
                style={{ color: barColor }}
            >
                {/* {value}% */}
            </span>
        </div>
    );
}
