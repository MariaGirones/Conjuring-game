import { ThemeProvider } from './hooks/useTheme'
import Game from './game/Game'

function App() {
  return (
    <ThemeProvider>
      <Game />
    </ThemeProvider>
  )
}

export default App