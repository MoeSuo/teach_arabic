export default function Button({
  children,
  onClick,
  disabled,
  type = "button",
  className,
}) {
  return (
    <button
      className={
        "w-full text-white focus:ring-4 focus:ring-stone-200 font-medium rounded px-4 py-3 mr-2 mb-2 " +
        (className ? className : "") +
        (disabled
          ? " bg-gray-300 pointer-events-none"
          : " bg-[#B58D63] hover:bg-[#CCA070]")
      }
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
