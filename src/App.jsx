import { useState, useEffect, useRef } from 'react';
import CanvasBoard from './components/CanvasBoard';
import './index.css';

// Simulation of system trying to guess
const WORDS = ['APPLE', 'SUN', 'TREE', 'HOUSE', 'CAR', 'CAT', 'DOG', 'COMPUTER'];
const WRONG_GUESSES = {
  'APPLE': ['Ball?', 'Red circle?', 'Fruit?', 'Cherry?'],
  'SUN': ['Ball?', 'Circle?', 'Yellow thing?', 'Cookie?'],
  'TREE': ['Broccoli?', 'Lollipop?', 'Bush?', 'Flower?'],
  'HOUSE': ['Box?', 'Square?', 'Barn?', 'Garage?'],
  'CAR': ['Box?', 'Truck?', 'Bus?', 'Train?'],
  'CAT': ['Dog?', 'Fox?', 'Tiger?', 'Lion?'],
  'DOG': ['Cat?', 'Wolf?', 'Bear?', 'Horse?'],
  'COMPUTER': ['TV?', 'Microwave?', 'Box?', 'Screen?']
};

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, playing, won
  const [tool, setTool] = useState('brush');
  const [color, setColor] = useState('#ffffff'); // Default white for dark bg
  const [lineWidth, setLineWidth] = useState(5);
  const [currentWord, setCurrentWord] = useState('');
  const [systemGuesses, setSystemGuesses] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  // Start Game Logic
  const startGame = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setGameState('playing');
    setSystemGuesses([]);
    setTimeLeft(60);
    setTool('brush');
    setColor('#ffffff');

    // Simulate system guessing
    let guessIndex = 0;
    const interval = setInterval(() => {
      if (guessIndex < (WRONG_GUESSES[word]?.length || 0)) {
        const wrongGuess = WRONG_GUESSES[word][guessIndex];
        addSystemGuess(wrongGuess);
        guessIndex++;
      } else {
        // System correctly guesses
        clearInterval(interval);
        addSystemGuess(word, true);
        setGameState('won');
      }
    }, 5000 + Math.random() * 3000); // Guess every 5-8 seconds

    timerRef.current = interval;
  };

  const addSystemGuess = (text, isCorrect = false) => {
    setSystemGuesses(prev => [...prev.slice(-4), { id: Date.now(), text, isCorrect }]); // Keep last 5
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      clearInterval(timerRef.current);
      setGameState('lost');
    }
  }, [gameState, timeLeft]);

  // Clean up timer on win/loss
  useEffect(() => {
    if (gameState === 'won' || gameState === 'lost') {
      clearInterval(timerRef.current);
    }
  }, [gameState]);


  return (
    <div className="h-screen w-full relative bg-[var(--color-bg)] overflow-hidden">

      {/* BACKGROUND CANVAS - FULL SCREEN */}
      <div className="absolute inset-0 z-0">
        <CanvasBoard color={color} lineWidth={lineWidth} tool={tool} />
      </div>

      {/* HEADER / STATUS */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        {gameState === 'playing' && (
          <div className="floating-panel px-6 py-3 rounded-full flex items-center gap-6 animate-[slideDown_0.5s_ease-out]">
            <div className={`text-2xl font-bold font-mono ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
              {timeLeft}s
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">Draw this</div>
              <div className="text-xl font-bold tracking-wider text-[var(--color-primary)]">{currentWord}</div>
            </div>
          </div>
        )}
      </div>

      {/* SYSTEM GUESSES TOASTS */}
      <div className="absolute top-24 right-8 z-20 flex flex-col gap-3 items-end pointer-events-none">
        {systemGuesses.map((guess, i) => (
          <div key={guess.id} className={`floating-panel px-4 py-2 rounded-lg backdrop-blur-md shadow-xl transition-all duration-500 transform translate-x-0 ${guess.isCorrect ? 'bg-green-500/80 border-green-400' : 'bg-slate-800/80'}`}>
            <span className="font-bold text-sm mr-2 text-white/60">System:</span>
            <span className={`font-bold ${guess.isCorrect ? 'text-white text-lg' : 'text-white'}`}>{guess.text}</span>
          </div>
        ))}
      </div>


      {/* UI OVERLAYS (LOBBY / GAME END) */}
      {(gameState === 'lobby' || gameState === 'won' || gameState === 'lost') && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="floating-panel p-8 rounded-2xl max-w-md w-full text-center border-white/10 shadow-2xl">
            {gameState === 'lobby' && (
              <>
                <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Draw & Guess</h1>
                <p className="text-slate-400 mb-8 text-lg">Test your drawing skills against our AI!</p>
                <button onClick={startGame} className="btn btn-primary w-full py-4 text-xl rounded-xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] transition-transform">
                  Start Playing
                </button>
              </>
            )}
            {gameState === 'won' && (
              <>
                <div className="text-6xl mb-4">You Won! 🎉</div>
                <p className="text-xl text-slate-300 mb-8">The system correctly guessed <b>{currentWord}</b>!</p>
                <button onClick={startGame} className="btn btn-primary w-full py-3 text-lg">Play Again</button>
              </>
            )}
            {gameState === 'lost' && (
              <>
                <div className="text-6xl mb-4">Time's Up ⏰</div>
                <p className="text-xl text-slate-300 mb-8">The word was <b>{currentWord}</b>.</p>
                <button onClick={startGame} className="btn btn-primary w-full py-3 text-lg">Try Again</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM TOOLBAR */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <div className="floating-panel p-2 rounded-2xl flex items-center gap-4 animate-[slideUp_0.5s_ease-out]">

          {/* Tools */}
          <div className="flex bg-slate-700/50 rounded-xl p-1">
            <button
              onClick={() => setTool('brush')}
              className={`p-3 rounded-lg transition-all ${tool === 'brush' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              title="Brush"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-3 rounded-lg transition-all ${tool === 'eraser' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              title="Eraser"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>

          <div className="w-px h-10 bg-white/10"></div>

          {/* Colors */}
          <div className="flex gap-2 px-2">
            {['#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'].map(c => (
              <button
                key={c}
                onClick={() => { setColor(c); setTool('brush'); }}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c && tool !== 'eraser' ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="w-px h-10 bg-white/10"></div>

          {/* Size */}
          <div className="flex items-center gap-2 px-2">
            <div className="text-xs text-slate-400 font-bold uppercase mr-1">Size</div>
            <input
              type="range"
              min="2" max="30"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-24 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

        </div>
      </div>

      {/* COPYRIGHT / WATERMARK */}
      <div className="absolute bottom-2 right-4 z-10 text-[10px] text-slate-600 pointer-events-none opacity-50">
        Draw & Guess • Created by Bill-sheng
      </div>

    </div>
  );
}

export default App;
