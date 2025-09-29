import { useEffect, useRef, useState } from 'react';

export const LoadingPage = () => {
  const [dots, setDots] = useState('');
  const intervalRef = useRef<number>();

  useEffect(() => {
    let index = 0;
    intervalRef.current = window.setInterval(() => {
      setDots('.'.repeat(index % 4));
      index++;
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'center',
        position: 'fixed',
        inset: 0,
        fontFamily: `'Inter', sans-serif`,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #EEFFFF, #FFFFFF)'
      }}
    >
      <header
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'start',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
          padding: '0.3rem',
          boxSizing: 'border-box',
          boxShadow: '0 0 4px rgba(0, 0, 0, 0.25)'
        }}
      >
        <a
          href="https://intelink.click"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem',
            textDecoration: 'none',
            padding: '0.3rem'
          }}
        >
          <img src="/logo.png" alt="Intelink Logo" style={{ width: 50, height: 50 }} />
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333',
              background: 'linear-gradient(90deg, #000000, #5599DD)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Intelink
          </span>
        </a>
      </header>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1.5rem',
          width: '100%',
          height: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'end',
            alignItems: 'center',
            width: '50%'
          }}
        >
          <img
            src="/icon-loading.svg"
            alt="Loading Icon"
            style={{
              width: 50,
              height: 50,
              animation: 'spin 2s linear infinite'
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'start',
            alignItems: 'center',
            width: '50%'
          }}
        >
          <span
            style={{
              fontSize: '2rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textShadow: '0 0 4px #77BBEE',
              color: '#5599DD'
            }}
          >
            Loading{dots}
          </span>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};
