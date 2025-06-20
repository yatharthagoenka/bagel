import './App.css';
import { useEffect, useRef } from 'react';

function App() {
  const textRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Convert mouse position to rotation degrees (limited range)
        const rotateX = Math.max(-20, Math.min(20, (mouseY / rect.height) * -30));
        const rotateY = Math.max(-20, Math.min(20, (mouseX / rect.width) * 30));
        
        textRef.current.style.setProperty('--mouse-x', `${rotateY}deg`);
        textRef.current.style.setProperty('--mouse-y', `${rotateX}deg`);
      }
    };

    const handleMouseLeave = () => {
      if (textRef.current) {
        textRef.current.style.setProperty('--mouse-x', '0deg');
        textRef.current.style.setProperty('--mouse-y', '0deg');
      }
    };

    const textElement = textRef.current;
    if (textElement) {
      textElement.addEventListener('mousemove', handleMouseMove);
      textElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (textElement) {
        textElement.removeEventListener('mousemove', handleMouseMove);
        textElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="App">
      <div className="content-3d">
        <div className="bagel-text" ref={textRef}>
          brewing...
        </div>
      </div>
      <div className="twitter-link">
        <a href="https://twitter.com/whhygee" target="_blank" rel="noopener noreferrer">
          @whhygee
        </a>
      </div>
    </div>
  );
}

export default App;
