export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 p-4">
    <div className="rounded-2xl bg-white p-6 text-center shadow-lg sm:p-10">
      <h1 className="mb-3 text-3xl font-bold text-blue-700 sm:mb-4 sm:text-4xl">Free Concert Tickets</h1>
      <p className="mb-4 text-gray-700 sm:mb-6">Welcome to our ticket booking system.</p>
      <div className="flex justify-center gap-2 sm:gap-3">
        <a href="/concerts" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base">User</a>
        <a href="/admin" className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 sm:px-6 sm:py-3 sm:text-base">Admin</a>
      </div>
    </div>
  </main>

  );
}
