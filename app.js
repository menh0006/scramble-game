/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/


const cities = [
  'paris','stockholm','buenos aires','madrid',
  'barcelona','manchester','london','ottawa',
  'montreal','dubai','toronto','calgary', 'hamilton', 'miami',
]


function Points({points}){
  return ( 
  <div className="col col-6 mt-4">
  <h2 className="text-center text-success ">
  {points}
  </h2>
  <p className="text-center fw-bold fs-3">Points</p>
  <div className="text-center"><i className="display-6 text-success fa fa-check-circle-o" aria-hidden="true"></i></div>
</div>
)
}

function Strikes({strikes}){
  return (
  <div className="col col-6 mt-4">
  <h2 className="text-center text-danger">
  {strikes}
  </h2>
  <p className="text-center fw-bold fs-3 ">Strikes</p>
  <div className="text-center"><i className="display-6 text-danger far fa-times-circle"></i></div>
</div>
)
}

function Message({message,variant}){
  const className = `alert alert-${variant}`
  return (
    <div>
      <div className={className}>{message}</div>
    </div>
  )
}

function Word({scrambled}){
  return (
  <div className="display-6 mb-4 text-center text-dark  my-3">{scrambled}</div>
  )
}

function Response ({active, guess, onGuessInput, onGuessSubmit}){
  return (
  <div>
    {active && (
  <form onSubmit={onGuessSubmit}>
    <input
      type="text"
      className="form-control mb-3"
      value={guess}
      onChange={onGuessInput}/>
  </form>)}
  {!active && (<input type="text" className="form-control mb-3" disabled />)}
  </div>
  )
}

function PassButton ({passes,onPass,disable}){
  return(
    <div>
      {!disable ? (<button className="btn btn-warning mt-4 mb-4" onClick={onPass}><span>{passes}</span> Passes Remaining</button>):
      <button className="btn btn-danger mt-4 mb-4" disabled>No Passes Remaining</button>}
    </div> 

  )
}

function PlayButton({onPlay}){
return(
  <button className="btn btn-success mt-3 mb-4" onClick={onPlay}>Play Again</button>
  
)
}


function App (){
  
  const [random, setRandom] = useLocalStorage('random', cities)
  const [points, setPoints] = useLocalStorage('points',0)
  const [strikes, setStrikes] = useLocalStorage('strikes',0)
  const [message, setMessage] = useLocalStorage('message','')
  const [variant, setVariant] = useLocalStorage('variant','')
  const [display, setDisplay] = useLocalStorage('display',true)
  const [passes, setPasses] = useLocalStorage('passes', 3)
  const [word, setWord] = useLocalStorage('word', random[0])
  const [scrambled, setScrambled] = useLocalStorage('scrambled',random[0])
  const [guess, setGuess] = useLocalStorage('guess','')
  const [active, setActive] = useLocalStorage('active',true)
  const [disable, setDisable] = useLocalStorage('disable',false)


  function PlayGame (){
    setActive(true)
    setPoints(0)
    setStrikes(0)
    setVariant('info')
    setPasses(3)
    setDisplay(true)
    setRandom(cities)
    setDisable(false)
    setMessage('Give it your best shot!')
  }

  function onGuessHandler (guess){
    if (guess.toLowerCase() === word.toLowerCase()){
      setPoints((prevState) => prevState + 1)

      if(random.length > 1) {
        setRandom(random.slice(1))
        setMessage('Correct! Next word.')
        setVariant('success')
        setDisplay(true)
      } else {
        setMessage('You won Scramble!')
        setVariant('success')
        setDisplay(true)
        setActive(false)
      }
    } else {
      if (strikes < 2) {
        setStrikes((prevState) => prevState + 1)
        setMessage('Incorrect! Try again.')
        setVariant('danger')
        setDisplay(true)
      } else {
        setStrikes((prevState) => prevState + 1)
        setMessage('No luck this time')
        setVariant('danger')
        setDisable(true)
        setDisplay(true)
        setActive(false)
      }
    }
  }

  React.useEffect(() => {
    setWord(random[0].toLowerCase())
    setScrambled(shuffle(random[0].toLowerCase()))
  }, [random.length])

  function PassGuess(e){
    e.preventDefault()
    if(random.length > 1 && passes > 1){
      setRandom(random.slice(1))
      setPasses((prevState) => prevState - 1)
      setDisplay(false)
    } else {
      setMessage('Looks like you ran out of passes!')
      setVariant('danger')
      setDisable(true)
      setDisplay(true)
    }
  }

  function changeHandler (e){
    setGuess(e.target.value)
  }

  function submitHandler (e){
    e.preventDefault()
    setGuess('')
    onGuessHandler(guess)
  }

  React.useEffect(() => {
    localStorage.setItem('play', JSON.stringify({
      random,
      points,
      strikes,
      message,
      variant,
      display,
      passes,
      word,
      scrambled,
      guess,
      active,
      disable
    }))
  })

  function useLocalStorage (key, defaultValue) {
    const ls = JSON.parse(localStorage.getItem('play'))

    return React.useState(ls ? ls[key] : defaultValue) 
  }

  return (
    <React.Fragment>
    <div className="p-3 mt-5 mb-5">
    <h1 className="h1 fw-bold display-6 p-2 mt-4 mb-4 text-center text-dark my-3">
      Guess the city
    </h1>
    <div className="row mb-5">
      <Points points={points}/>
      <Strikes strikes={strikes}/>
    </div>
    <div className="row d-grid">
      <div className="col col-10 offset-1 text-center grid-column-1 grid-row-1">
        {display && <Message message={message} variant={variant}/>}
        {active && (<Word scrambled={scrambled} />)}
        <Response
              active={active}
              guess={guess}
              onGuessInput={(e) => changeHandler(e)}
              onGuessSubmit={(e) => submitHandler(e)}
              />
        <PassButton passes={passes} onPass={PassGuess} disable={disable}/>
        {!active && <PlayButton onPlay={PlayGame}/>}
      </div>
    </div>   
  </div>
    </React.Fragment>

  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
