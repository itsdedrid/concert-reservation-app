export function Label({ children }: { children: React.ReactNode }) {
    return <label className="mb-1 block text-sm font-medium text-gray-700">{children}</label>;
  }
  export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`} />;
  }
  export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`} />;
  }
  