import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { auth } from './firebase'

export async function loginAdmin(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  // Set a simple cookie so middleware can detect auth state
  document.cookie = 'batikan-auth=1; path=/; max-age=86400; SameSite=Strict'
  return result.user
}

export async function logoutAdmin() {
  await signOut(auth)
  document.cookie = 'batikan-auth=; path=/; max-age=0'
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      document.cookie = 'batikan-auth=1; path=/; max-age=86400; SameSite=Strict'
    } else {
      document.cookie = 'batikan-auth=; path=/; max-age=0'
    }
    callback(user)
  })
}
