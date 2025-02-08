
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			keyframes: {
				"image-fade": {
					"0%": { opacity: "1" },
					"10%": { opacity: "0.2" },
					"12%": { opacity: "1" },
					"40%": { opacity: "1" },
					"42%": { opacity: "0.2" },
					"44%": { opacity: "1" },
					"70%": { opacity: "1" },
					"72%": { opacity: "0.2" },
					"74%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-1": {
					"0%": { opacity: "1" },
					"15%": { opacity: "0.1" },
					"17%": { opacity: "1" },
					"45%": { opacity: "1" },
					"47%": { opacity: "0.1" },
					"49%": { opacity: "1" },
					"75%": { opacity: "1" },
					"77%": { opacity: "0.1" },
					"79%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-2": {
					"0%": { opacity: "1" },
					"20%": { opacity: "0.3" },
					"22%": { opacity: "1" },
					"50%": { opacity: "1" },
					"52%": { opacity: "0.3" },
					"54%": { opacity: "1" },
					"80%": { opacity: "1" },
					"82%": { opacity: "0.3" },
					"84%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-3": {
					"0%": { opacity: "1" },
					"25%": { opacity: "0.4" },
					"27%": { opacity: "1" },
					"55%": { opacity: "1" },
					"57%": { opacity: "0.4" },
					"59%": { opacity: "1" },
					"85%": { opacity: "1" },
					"87%": { opacity: "0.4" },
					"89%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-4": {
					"0%": { opacity: "1" },
					"30%": { opacity: "0.5" },
					"32%": { opacity: "1" },
					"60%": { opacity: "1" },
					"62%": { opacity: "0.5" },
					"64%": { opacity: "1" },
					"90%": { opacity: "1" },
					"92%": { opacity: "0.5" },
					"94%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-5": {
					"0%": { opacity: "1" },
					"5%": { opacity: "0.6" },
					"7%": { opacity: "1" },
					"35%": { opacity: "1" },
					"37%": { opacity: "0.6" },
					"39%": { opacity: "1" },
					"65%": { opacity: "1" },
					"67%": { opacity: "0.6" },
					"69%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-6": {
					"0%": { opacity: "1" },
					"8%": { opacity: "0.7" },
					"10%": { opacity: "1" },
					"38%": { opacity: "1" },
					"40%": { opacity: "0.7" },
					"42%": { opacity: "1" },
					"68%": { opacity: "1" },
					"70%": { opacity: "0.7" },
					"72%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-7": {
					"0%": { opacity: "1" },
					"12%": { opacity: "0.8" },
					"14%": { opacity: "1" },
					"42%": { opacity: "1" },
					"44%": { opacity: "0.8" },
					"46%": { opacity: "1" },
					"72%": { opacity: "1" },
					"74%": { opacity: "0.8" },
					"76%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-8": {
					"0%": { opacity: "1" },
					"16%": { opacity: "0.15" },
					"18%": { opacity: "1" },
					"46%": { opacity: "1" },
					"48%": { opacity: "0.15" },
					"50%": { opacity: "1" },
					"76%": { opacity: "1" },
					"78%": { opacity: "0.15" },
					"80%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-9": {
					"0%": { opacity: "1" },
					"22%": { opacity: "0.25" },
					"24%": { opacity: "1" },
					"52%": { opacity: "1" },
					"54%": { opacity: "0.25" },
					"56%": { opacity: "1" },
					"82%": { opacity: "1" },
					"84%": { opacity: "0.25" },
					"86%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"image-fade-10": {
					"0%": { opacity: "1" },
					"28%": { opacity: "0.35" },
					"30%": { opacity: "1" },
					"58%": { opacity: "1" },
					"60%": { opacity: "0.35" },
					"62%": { opacity: "1" },
					"88%": { opacity: "1" },
					"90%": { opacity: "0.35" },
					"92%": { opacity: "1" },
					"100%": { opacity: "1" }
				},
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				"image-fade": "image-fade 3000s ease-in-out infinite",
				"image-fade-1": "image-fade-1 3000s ease-in-out infinite",
				"image-fade-2": "image-fade-2 3000s ease-in-out infinite",
				"image-fade-3": "image-fade-3 3000s ease-in-out infinite",
				"image-fade-4": "image-fade-4 3000s ease-in-out infinite",
				"image-fade-5": "image-fade-5 3000s ease-in-out infinite",
				"image-fade-6": "image-fade-6 3000s ease-in-out infinite",
				"image-fade-7": "image-fade-7 3000s ease-in-out infinite",
				"image-fade-8": "image-fade-8 3000s ease-in-out infinite",
				"image-fade-9": "image-fade-9 3000s ease-in-out infinite",
				"image-fade-10": "image-fade-10 3000s ease-in-out infinite",
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
