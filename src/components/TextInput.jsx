function TextInput({ id, label, error, className = '', ...props }) {
  const classes = ['form-field__input', className].filter(Boolean).join(' ')

  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-field__label">{label}</span>
      <input
        className={classes}
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      />
      {error && (
        <span className="form-field__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

export default TextInput
