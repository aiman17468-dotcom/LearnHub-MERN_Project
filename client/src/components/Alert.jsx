// Shows an error or success message (renders nothing if there is no text)
function Alert({ type = 'error', children }) {
  if (!children) return null;
  return (
    <p className={`alert ${type}`} role={type === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}

export default Alert;
