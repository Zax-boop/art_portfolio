"use client"

import { useState, useEffect } from 'react';
import signIn from "../../../../utils/general/signIn"
import { User } from '@supabase/supabase-js';
import supabase from '../../../../utils/general/supabaseclient';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };

    getSession();
  }, []);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mounted) return;
    setLoading(true);
    setError('');
    const user = await signIn(email, password);
    if (!user) {
      setError('Invalid credentials, please try again.');
      setLoading(false);
      return;
    }
    setLoading(false);
    router.push('/');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleButton = () => {
    if (!user) {
      setModalOpen(true)
    } else {
      handleSignOut()
    }
  }

  return (
    <>
      <div className='absolute top-5 xs:hidden sm:block right-4'>
        <label onClick={() => handleButton()} className="flex flex-row justify-center items-center gap-2 self-start px-2 md:px-3 py-1.5 md:py-2 bg-black border border-white text-white rounded-full hover:bg-white hover:text-white transition duration-300 cursor-pointer text-xs md:text-base">
          {!user ? `Sign In` : `Sign Out`}
        </label>
      </div>
      {modalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className='bg-black w-full max-w-[30rem] p-6 rounded-lg shadow-lg relative'>
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <h1 className="text-2xl font-semibold text-center mb-4">Sign In</h1>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-white"
            />
            <button
              type="submit"
              className="w-full flex flex-row justify-center py-2 bg-blue-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>}
    </>
  );
}
