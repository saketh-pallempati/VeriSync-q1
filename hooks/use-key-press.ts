import { useEffect, useCallback } from 'react'

export function useKeyPress(targetKeys: string[], callback: () => void) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const pressedKeys = targetKeys.map(key => key.toLowerCase())
      const isTargetKeyPressed = pressedKeys.every(key => 
        event.key.toLowerCase() === key || 
        event[`${key}Key` as keyof KeyboardEvent]
      )

      if (isTargetKeyPressed) {
        event.preventDefault()
        callback()
      }
    },
    [targetKeys, callback]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])
}