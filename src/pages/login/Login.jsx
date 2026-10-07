import React from 'react'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <section className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Login</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="email" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">Login</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Don&apos;t have an account? <Link to="/signin" className="font-medium text-blue-600 hover:underline">Sign up</Link>
      </p>
    </section>
  )
}

export default Login