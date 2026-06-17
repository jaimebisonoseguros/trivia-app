import { useState, useEffect } from 'react'
import './App.css'

const TIMER_SECONDS = 15

const questions = [
  {
    question: 'Which Hogwarts house does Harry Potter belong to?',
    options: ['Slytherin', 'Hufflepuff', 'Gryffindor', 'Ravenclaw'],
    answer: 'Gryffindor',
    hint: 'The house of the brave, with a lion as its symbol.',
  },
  {
    question: 'What is the name of Harry Potter\'s owl?',
    options: ['Errol', 'Hedwig', 'Pigwidgeon', 'Fawkes'],
    answer: 'Hedwig',
    hint: 'A snowy white owl, gifted to him on his birthday.',
  },
  {
    question: 'In which Netflix series does Jason Bateman play Marty Byrde, a money-laundering accountant?',
    options: ['Breaking Bad', 'Narcos', 'Ozark', 'Bloodline'],
    answer: 'Ozark',
    hint: 'The show is set near a lake in Missouri.',
  },
  {
    question: 'In which animated movie does Jason Bateman voice the sly fox Nick Wilde?',
    options: ['Kung Fu Panda', 'Zootopia', 'The Jungle Book', 'Ice Age'],
    answer: 'Zootopia',
    hint: 'A city where all kinds of animals live together.',
  },
  {
    question: 'In "Titanic", what is the name of Leonardo DiCaprio\'s character?',
    options: ['Jack Dawson', 'James Dawson', 'Leo Dawson', 'Jack Sparrow'],
    answer: 'Jack Dawson',
    hint: 'He wins his ticket to the Titanic in a card game.',
  },
  {
    question: 'Which actress plays Katniss Everdeen in "The Hunger Games"?',
    options: ['Emma Watson', 'Jennifer Lawrence', 'Scarlett Johansson', 'Shailene Woodley'],
    answer: 'Jennifer Lawrence',
    hint: 'She won an Oscar for "Silver Linings Playbook".',
  },
  {
    question: 'In "Home Alone", what is the main character\'s name?',
    options: ['Kevin McCallister', 'Billy Madison', 'Richie Rich', 'Danny Tanner'],
    answer: 'Kevin McCallister',
    hint: 'His whole family leaves for Paris without him.',
  },
  {
    question: 'What movie features the famous line "To infinity and beyond!"?',
    options: ['Shrek', 'Toy Story', 'A Bug\'s Life', 'Cars'],
    answer: 'Toy Story',
    hint: 'It\'s said by a space ranger action figure.',
  },
  {
    question: 'In Stanley Kubrick\'s "The Shining", what does Jack Torrance type obsessively on his typewriter?',
    options: [
      'I am going crazy',
      'All work and no play makes Jack a dull boy',
      'Here\'s Johnny',
      'Redrum redrum redrum',
    ],
    answer: 'All work and no play makes Jack a dull boy',
    hint: 'It\'s a famous English proverb — repeated thousands of times.',
  },
  {
    question: 'Which David Lynch film follows a woman who discovers a severed ear in a field, leading her into a dark underworld?',
    options: ['Mulholland Drive', 'Lost Highway', 'Blue Velvet', 'Eraserhead'],
    answer: 'Blue Velvet',
    hint: 'The film stars Kyle MacLachlan and Isabella Rossellini.',
  },
  {
    question: 'Who plays the two popes in "The Two Popes"?',
    options: [
      'Tom Hanks & Denzel Washington',
      'Anthony Hopkins & Jonathan Pryce',
      'Al Pacino & Robert De Niro',
      'Javier Bardem & Antonio Banderas',
    ],
    answer: 'Anthony Hopkins & Jonathan Pryce',
    hint: 'One of them also played Hannibal Lecter.',
  },
]

const BG_ICONS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: `${Math.floor((i * 37 + 5) % 100)}%`,
  left: `${Math.floor((i * 53 + 10) % 100)}%`,
  rotate: `${(i * 47) % 360}deg`,
  size: `${40 + (i * 13) % 40}px`,
}))

function Background({ hearts = false }) {
  const emoji = hearts ? '💕' : '🎥'
  return (
    <div className="bg-pattern">
      {BG_ICONS.map(({ id, top, left, rotate, size }) => (
        <span key={id} style={{ top, left, transform: `rotate(${rotate})`, fontSize: size }}>{emoji}</span>
      ))}
    </div>
  )
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [finalAnswer, setFinalAnswer] = useState(null)
  const [noPos, setNoPos] = useState({ x: 0, y: 0 })
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)

  useEffect(() => {
    if (!started || finished) return
    setTimeLeft(TIMER_SECONDS)
  }, [current, started, finished])

  useEffect(() => {
    if (!started || finished || selected) return
    if (timeLeft <= 0) {
      handleNext()
      return
    }
    const t = setTimeout(() => setTimeLeft(n => n - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, started, finished, selected])

  function handleOption(option) {
    if (selected) return
    setSelected(option)
    if (option === questions[current].answer) {
      setScore(s => s + 1)
    }
  }

  function handleNext() {
    setSelected(null)
    setShowHint(false)
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  function handleNoEscape() {
    const x = (Math.random() - 0.5) * 300
    const y = (Math.random() - 0.5) * 200
    setNoPos({ x, y })
  }

  if (!started && !showInstructions) {
    return (
      <div className="app intro-screen">
        <Background />
        <h1 className="intro-title">THE BIG<br/>SCREEN QUIZ</h1>
        <button className="start-btn" onClick={() => setShowInstructions(true)}>
          Let's play!
        </button>
      </div>
    )
  }

  if (showInstructions && !started) {
    return (
      <div className="app intro-screen">
        <Background />
        <div className="instructions-card">
          <h2 className="instr-title">📋 How to play</h2>
          <ul className="instr-list">
            <li>🎬 Movie trivia — multiple choice, 4 options each.</li>
            <li>⏱️ You have <strong>15 seconds</strong> per question.</li>
            <li>💡 Use a <strong>Hint</strong> if you need help.</li>
            <li>⭐ Each correct answer gives you a point.</li>
            <li>🎭 At the end, one last question — just be honest 🙂</li>
          </ul>
          <button className="start-btn" onClick={() => setStarted(true)}>
            I'm ready!
          </button>
        </div>
      </div>
    )
  }

  if (finalAnswer === 'si') {
    return (
      <div className="app final-yes">
        <Background hearts />
      </div>
    )
  }

  if (finished) {
    return (
      <div className="app final-screen">
        <Background hearts />
        <h1 className="final-question">¿Quieres ser mi novia?</h1>
        <div className="final-buttons">
          <button className="btn-si" onClick={() => setFinalAnswer('si')}>
            Sí 💖
          </button>
          <button
            className="btn-no"
            style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
            onMouseEnter={handleNoEscape}
            onTouchStart={handleNoEscape}
          >
            No
          </button>
        </div>
      </div>
    )
  }

  const q = questions[current]
  const timerPct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft > 8 ? '#48c78e' : timeLeft > 4 ? '#ffd54f' : '#f14668'

  return (
    <div className="app">
      <Background />
      <div className="header">
        <span className="progress">Question {current + 1}</span>
        <span className="score-badge">⭐ {score}</span>
      </div>

      <div className="timer-bar-wrap">
        <div
          className="timer-bar"
          style={{ width: `${timerPct}%`, background: timerColor }}
        />
      </div>

      <div className="card">
        <h2 className="question">{q.question}</h2>

        {showHint && <div className="hint">💡 {q.hint}</div>}

        <div className="options">
          {q.options.map(opt => {
            let cls = 'option'
            if (selected) {
              if (opt === q.answer) cls += ' correct'
              else if (opt === selected) cls += ' wrong'
            }
            return (
              <button key={opt} className={cls} onClick={() => handleOption(opt)}>
                {opt}
              </button>
            )
          })}
        </div>

        <div className="actions">
          {!selected && !showHint && (
            <button className="hint-btn" onClick={() => setShowHint(true)}>
              💡 Hint
            </button>
          )}
          {selected && (
            <button className="next-btn" onClick={handleNext}>
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
