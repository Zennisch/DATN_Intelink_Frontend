import {useEffect, useRef} from 'react';

const PageSpinner = () => {
	const loadingTextRef = useRef<HTMLSpanElement>(null);
	const intervalRef = useRef<number>();

	useEffect(() => {
		const text = 'Loading';
		let index = 0;

		intervalRef.current = window.setInterval(() => {
			if (loadingTextRef.current) {
				if (index % 4 !== 0) {
					loadingTextRef.current.textContent = text + '.'.repeat(index % 4);
				} else {
					loadingTextRef.current.textContent = text;
				}
			}
			index++;
		}, 500);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return (
		<div style={styles.preloader}>
			<header style={styles.preloadHeader}>
				<a href="https://intelink.click" target="_blank" rel="noopener noreferrer" style={styles.headerLink}>
					<img src="./assets/logo.png" alt="Intelink Logo" style={styles.headerLogo} />
					<span style={styles.headerText}>Intelink</span>
				</a>
			</header>

			<div style={styles.preloadContainer}>
				<div style={styles.preloadContainerIcon}>
					<img src="./assets/icon-loading-cyan.svg" alt="Loading Icon" style={styles.loadingIcon} />
				</div>
				<div style={styles.preloadContainerText}>
					<span ref={loadingTextRef} style={styles.loadingText}>
						Loading
					</span>
				</div>
			</div>
		</div>
	);
};

const styles: {[key: string]: React.CSSProperties} = {
	preloader: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		position: 'fixed',
		inset: 0,
		fontFamily: "'Inter', sans-serif",
		transition: 'opacity 0.5s ease',
		overflow: 'hidden',
	},
	preloadHeader: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '0.5rem',
		position: 'relative',
		width: '100%',
		padding: '0.5rem 1rem',
		boxSizing: 'border-box',
		boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
		background: '#fff',
	},
	headerLink: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: '0.75rem',
		textDecoration: 'none',
		padding: '0.25rem',
	},
	headerLogo: {
		width: '40px',
		height: '40px',
		flexShrink: 0,
	},
	headerText: {
		fontSize: '1.25rem',
		fontWeight: 600,
		color: '#333',
		background: 'linear-gradient(90deg, #000000, #5599dd)',
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
	},
	preloadContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '1.5rem',
		width: '100%',
		height: '100%',
		background: 'linear-gradient(135deg, #eeffff, #ffffff)',
		padding: '1rem',
	},
	preloadContainerIcon: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '50%',
	},
	loadingIcon: {
		width: '50px',
		height: '50px',
		animation: 'spin 2s linear infinite',
	},
	preloadContainerText: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '50%',
	},
	loadingText: {
		fontSize: '1.75rem',
		fontWeight: 500,
		letterSpacing: '0.05em',
		textShadow: '0 0 4px #77bbee',
		color: '#5599dd',
	},
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @media screen and (max-width: 768px) {
        .page-spinner-header {
            padding: 0.4rem 0.75rem !important;
            gap: 0.4rem !important;
        }
        .page-spinner-header-link {
            gap: 0.5rem !important;
        }
        .page-spinner-header-logo {
            width: 32px !important;
            height: 32px !important;
        }
        .page-spinner-header-text {
            font-size: 1.1rem !important;
        }
        .page-spinner-container {
            gap: 1rem !important;
            padding: 0.75rem !important;
        }
        .page-spinner-loading-icon {
            width: 40px !important;
            height: 40px !important;
        }
        .page-spinner-loading-text {
            font-size: 1.5rem !important;
        }
    }

    @media screen and (max-width: 480px) {
        .page-spinner-header {
            padding: 0.3rem 0.5rem !important;
            gap: 0.3rem !important;
        }
        .page-spinner-header-link {
            gap: 0.4rem !important;
        }
        .page-spinner-header-logo {
            width: 28px !important;
            height: 28px !important;
        }
        .page-spinner-header-text {
            font-size: 1rem !important;
        }
        .page-spinner-container {
            flex-direction: column !important;
            gap: 0.75rem !important;
            padding: 0.5rem !important;
        }
        .page-spinner-container-icon,
        .page-spinner-container-text {
            width: 100% !important;
            justify-content: center !important;
        }
        .page-spinner-loading-icon {
            width: 36px !important;
            height: 36px !important;
        }
        .page-spinner-loading-text {
            font-size: 1.25rem !important;
        }
    }

    @media screen and (max-width: 360px) {
        .page-spinner-header-logo {
            width: 24px !important;
            height: 24px !important;
        }
        .page-spinner-header-text {
            font-size: 0.9rem !important;
        }
        .page-spinner-loading-icon {
            width: 32px !important;
            height: 32px !important;
        }
        .page-spinner-loading-text {
            font-size: 1.1rem !important;
        }
    }
`;

if (typeof document !== 'undefined' && !document.querySelector('#page-spinner-styles')) {
	styleSheet.id = 'page-spinner-styles';
	document.head.appendChild(styleSheet);
}

export default PageSpinner;
