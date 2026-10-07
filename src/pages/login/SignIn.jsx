import React from 'react'
import { Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <section className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Create an account</h1>
      <form className="space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
          <input id="signup-name" name="name" type="text" autoComplete="name" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <div>
          <label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input id="signup-email" name="email" type="email" autoComplete="email" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <div>
          <label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input id="signup-password" name="password" type="password" autoComplete="new-password" required className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-600" />
        </div>
        <button type="submit" className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">Sign up</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Login</Link>
      </p>
    </section>
  )
}

export default SignIn