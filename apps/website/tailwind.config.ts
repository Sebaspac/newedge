
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
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem',
				xl: '2rem',
				'2xl': '2rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
		fontFamily: {
				'sans': ['Consolas', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', 'monospace'],
				'heading': ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
				'mono': ['Consolas', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Liberation Mono', 'Courier New', 'monospace'],
				'epilogue': ['Epilogue', 'Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: 'hsl(var(--surface))',
				'surface-elevated': 'hsl(var(--surface-elevated))',
				// NEWEDGE Kanonische Palette (Brandboard 2026-07) — direkt adressierbar
				// als bg-ne-lime / text-ne-ink / border-ne-hairline usw.
				// Referenz + Verbote: FARBPALETTE.md in der Repo-Wurzel.
				// Lime NIE als Textfarbe auf hellem Grund — dafür ne-flash.
				ne: {
					lime: '#CCFF00',
					ink: '#171717',
					paper: '#F2F2F2',
					flash: '#FF1E00',
					white: '#FFFFFF',
					'ink-soft': '#3C3C3C',
					'ink-muted': '#5E5E5A',
					'ink-deep': '#101010',
					'ink-raise': '#1F1F1F',
					error: '#B91C1C',
					success: '#15803D',
					'ink-06': 'rgba(23, 23, 23, 0.06)',
					hairline: 'rgba(23, 23, 23, 0.14)',
					'hairline-strong': 'rgba(23, 23, 23, 0.22)',
					'ink-quiet': 'rgba(23, 23, 23, 0.45)',
					'ink-secondary': 'rgba(23, 23, 23, 0.68)',
					scrim: 'rgba(23, 23, 23, 0.92)',
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))',
					subtle: 'hsl(var(--primary-subtle))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					glow: 'hsl(var(--secondary-glow))',
					subtle: 'hsl(var(--secondary-subtle))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					glow: 'hsl(var(--accent-glow))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'red-800': 'var(--ds-red-800)',
				'red-900': 'var(--ds-red-900)',
				'amber-800': 'var(--ds-amber-800)',
				'amber-850': 'var(--ds-amber-850)',
				'gray-100': 'var(--ds-gray-100)',
				'gray-400': 'var(--ds-gray-400)',
				'gray-700': 'var(--ds-gray-700)',
				'gray-1000': 'var(--ds-gray-1000)',
				'gray-1000-h': 'var(--ds-gray-1000-h)',
				'gray-alpha-200': 'var(--ds-gray-alpha-200)',
				'gray-alpha-400': 'var(--ds-gray-alpha-400)',
				'background-100': 'var(--ds-background-100)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				xl: 'var(--radius-lg)',
				'2xl': 'var(--radius-xl)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'strong': 'var(--shadow-strong)',
				'glow': 'var(--shadow-glow)',
				'accent': 'var(--shadow-accent)',
				'focus-ring': 'var(--ds-focus-ring)',
				'border-small': 'var(--ds-shadow-border-small)',
				// Kanonische Karten-Schatten (ersetzen inline-boxShadow-Duplikate)
				'ne-card': 'var(--ne-shadow-card)',
				'ne-lift': 'var(--ne-shadow-lift)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-accent': 'var(--gradient-accent)',
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-glow': 'var(--gradient-glow)',
				// Die drei erlaubten Marken-Verläufe.
				// Präfix "gradient-" ist Pflicht: ein Key `ne-ink` erzeugte
				// `bg-ne-ink` und würde die gleichnamige Flächenfarbe verdecken.
				'gradient-ne-ink': 'var(--ne-ink-gradient)',
				'gradient-ne-lime': 'var(--ne-lime-gradient)',
				'gradient-ne-showcase': 'var(--ne-showcase-gradient)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'slide-up': {
					from: { opacity: '0', transform: 'translateY(60px) scale(0.95)' },
					to: { opacity: '1', transform: 'translateY(0) scale(1)' }
				},
				'slide-in-left': {
					from: { opacity: '0', transform: 'translateX(-60px) scale(0.95)' },
					to: { opacity: '1', transform: 'translateX(0) scale(1)' }
				},
				'slide-in-right': {
					from: { opacity: '0', transform: 'translateX(60px) scale(0.95)' },
					to: { opacity: '1', transform: 'translateX(0) scale(1)' }
				},
				'scale-in': {
					from: { opacity: '0', transform: 'scale(0.8) rotate(-5deg)' },
					to: { opacity: '1', transform: 'scale(1) rotate(0deg)' }
				},
				'float-soft': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'50%': { transform: 'translateY(-8px) rotate(1deg)' }
				},
				'rotate-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'glow-pulse-modern': {
					'0%, 100%': { 
						boxShadow: '0 0 30px hsl(var(--primary-glow) / 0.3), 0 0 60px hsl(var(--primary-glow) / 0.1)'
					},
					'50%': { 
						boxShadow: '0 0 50px hsl(var(--primary-glow) / 0.6), 0 0 100px hsl(var(--primary-glow) / 0.2)'
					}
				},
				'text-reveal': {
					from: { opacity: '0', transform: 'translateY(100%)', filter: 'blur(4px)' },
					to: { opacity: '1', transform: 'translateY(0)', filter: 'blur(0px)' }
				},
				'gradient-flow': {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' }
				},
				'shimmer-effect': {
					'0%': { backgroundPosition: '-1000px 0', opacity: '0' },
					'30%': { opacity: '1' },
					'100%': { backgroundPosition: '1000px 0', opacity: '0' }
				},
				'parallax-float': {
					'0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
					'25%': { transform: 'translateY(-10px) translateX(5px)' },
					'50%': { transform: 'translateY(0px) translateX(10px)' },
					'75%': { transform: 'translateY(10px) translateX(5px)' }
				},
				'magnetic-hover': {
					'0%': { transform: 'scale(1) rotate(0deg)' },
					'50%': { transform: 'scale(1.05) rotate(2deg)' },
					'100%': { transform: 'scale(1.1) rotate(0deg)' }
				},
				'spotlight': {
					'0%': { opacity: '0', transform: 'translate(-72%, -62%) scale(0.5)' },
					'100%': { opacity: '1', transform: 'translate(-50%,-40%) scale(1)' }
				},
				'fade-spin': {
					'0%, 39%, 100%': { opacity: '0.25' },
					'40%': { opacity: '1' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.8', transform: 'scale(1.05)' }
				},
				'marquee': {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(-50%)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-up': 'slide-up var(--duration-slow) var(--ease-out)',
				'slide-left': 'slide-in-left var(--duration-slow) var(--ease-out)',
				'slide-right': 'slide-in-right var(--duration-slow) var(--ease-out)',
				'scale-in': 'scale-in var(--duration-normal) var(--ease-bounce)',
				'text-reveal': 'text-reveal 0.8s var(--ease-out)',
				'float': 'float-soft 6s ease-in-out infinite',
				'rotate': 'rotate-slow 20s linear infinite',
				'glow': 'glow-pulse-modern 3s ease-in-out infinite',
				'gradient': 'gradient-flow 8s ease-in-out infinite',
				'shimmer': 'shimmer-effect 3s ease-in-out infinite',
				'parallax': 'parallax-float 8s ease-in-out infinite',
				'spotlight': 'spotlight 2s ease 0.75s 1 forwards',
				'fade-spin': 'fade-spin 1s linear infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
				'marquee': 'marquee 30s linear infinite'
			},
			transitionTimingFunction: {
				'ease-out': 'var(--ease-out)',
				'ease-in-out': 'var(--ease-in-out)',
				'ease-bounce': 'var(--ease-bounce)'
			},
			transitionDuration: {
				'fast': 'var(--duration-fast)',
				'normal': 'var(--duration-normal)',
				'slow': 'var(--duration-slow)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			addUtilities({
				'.scrollbar-hide': {
					'-ms-overflow-style': 'none',
					'scrollbar-width': 'none',
					'&::-webkit-scrollbar': {
						display: 'none'
					}
				},
				// Safari-compatible backdrop-filter utilities
				'.backdrop-blur-safari': {
					'-webkit-backdrop-filter': 'blur(8px)',
					'backdrop-filter': 'blur(8px)',
					'transform': 'translate3d(0, 0, 0)'
				},
				'.backdrop-blur-md-safari': {
					'-webkit-backdrop-filter': 'blur(12px)',
					'backdrop-filter': 'blur(12px)',
					'transform': 'translate3d(0, 0, 0)'
				},
				'.backdrop-blur-lg-safari': {
					'-webkit-backdrop-filter': 'blur(16px)',
					'backdrop-filter': 'blur(16px)',
					'transform': 'translate3d(0, 0, 0)'
				}
			});
		}
	],
} satisfies Config;
