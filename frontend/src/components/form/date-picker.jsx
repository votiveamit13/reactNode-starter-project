import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

// export default function DatePicker({
//   mode,
//   onChange,
//   label,
//   defaultDate,
//   placeholder,
// }) {
//   const inputRef = useRef(null);

//   useEffect(() => {
//     if (!inputRef.current) return;

//     const instance = flatpickr(inputRef.current, {
//       mode: mode || "single",
//       dateFormat: "Y-m-d",
//       defaultDate,
//       onChange: (selectedDates, dateStr) => {
//         onChange && onChange(dateStr);
//       },
//     });

//     return () => instance.destroy();
//   }, [mode, defaultDate]);

//   return (
//     <div>
//       {label && <Label>{label}</Label>}

//       <div className="relative">
//         <input
//           ref={inputRef}
//           placeholder={placeholder}
//           className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm
//           bg-transparent text-gray-800 border-gray-300
//           focus:border-brand-300 focus:ring-brand-500/20"
//         />

//         <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
//           <CalenderIcon className="size-6" />
//         </span>
//       </div>
//     </div>
//   );
// }


export default function DatePicker({
  mode,
  onChange,
  label,
  defaultDate,
  value,        // ✅ add value prop
  placeholder,
}) {
  const inputRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;

  instanceRef.current = flatpickr(inputRef.current, {
    mode: mode || "single",
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "d/m/Y",
    defaultDate: value || defaultDate,
    onReady: (_, __, fp) => {
      // Style the alt input to match your design
      fp.altInput.className = "h-11 w-full rounded-lg border px-4 py-2.5 text-sm bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:outline-none";
    },
    onChange: (selectedDates, dateStr) => {
      onChange && onChange(dateStr);
    },
  });

    return () => instanceRef.current?.destroy();
  }, [mode]);

  // When value changes externally, update flatpickr
  useEffect(() => {
    if (!instanceRef.current) return;
    if (value) {
      instanceRef.current.setDate(value, false); // false = don't trigger onChange
    } else {
      instanceRef.current.clear();
    }
  }, [value]);

  return (
    <div>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          ref={inputRef}
          placeholder={placeholder}
          style={{ display: "none" }}
          className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm
          bg-transparent text-gray-800 border-gray-300
          focus:border-brand-300 focus:ring-brand-500/20"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}