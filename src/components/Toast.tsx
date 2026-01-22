interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast = ({ message, visible }: ToastProps) => {
  if (!visible) return null;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-semibold text-[clamp(16px,4vw,32px)] pointer-events-none z-10"
    >
      {message}
    </div>
  );
};

export default Toast;
