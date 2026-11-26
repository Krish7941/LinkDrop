import { useEffect, useId } from 'react'
import Button from './Button.jsx'
import Icon from './Icon.jsx'

function Modal({ title, onClose, children }) {
  const titleId = useId()

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="modal-heading">
          <h2 id={titleId}>{title}</h2>
          <Button
            variant="icon"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <Icon name="x" size={18} />
          </Button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default Modal
