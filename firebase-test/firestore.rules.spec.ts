/**
 * @jest-environment node
 */

import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import * as fs from 'fs'
import {
  getDoc,
  doc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore'
import { FirebaseFirestore } from '@firebase/firestore-types'
import firebase from 'firebase/compat'

const PROJECT_ID = 'firestore-rules'

describe('Firestore security rules', () => {
  let testEnv: RulesTestEnvironment
  let player: firebase.firestore.Firestore | FirebaseFirestore
  let coach: firebase.firestore.Firestore | FirebaseFirestore
  let admin: firebase.firestore.Firestore | FirebaseFirestore

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: fs.readFileSync('./firestore.rules', 'utf8'),
        port: 8080,
        host: '127.0.0.1',
      }
    })

    player = testEnv
      .authenticatedContext('player', {
        // @ts-expect-error
        sub: 'player',
        email: 'player@test.com',
        email_verified: true,
        capabilities: [
          'events:list',
          'events:get:own',
          'users:get:own',
          'users:update:own',
        ],
      })
      .firestore()

    coach = testEnv
      .authenticatedContext('coach', {
        // @ts-expect-error
        sub: 'coach',
        email: 'coach@test.com',
        email_verified: true,
        capabilities: ['events:manage', 'users:get:own', 'users:update:own'],
      })
      .firestore()

    admin = testEnv
      .authenticatedContext('admin', {
        // @ts-expect-error
        sub: 'admin',
        email: 'admin@test.com',
        email_verified: true,
        capabilities: ['all:manage'],
      })
      .firestore()
  })

  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const db = context.firestore()
      await db.doc('events/1').set({ name: 'test', uid: 'player' })
      await db.doc('events/2').set({ name: 'test', uid: 'player' })
      await db.doc('users/1').set({ name: 'player', uid: 'player' })
      await db.doc('users/2').set({ name: 'coach', uid: 'coach' })
      await db.doc('users/3').set({ name: 'admin', uid: 'admin' })
    })
  })

  it('player can read event', async () => {
    const docRef = doc(player, 'events/1')
    await assertSucceeds(getDoc(docRef))
  })

  it('player can read all events', async () => {
    const docRef = collection(player, 'events')
    await assertSucceeds(getDocs(docRef))
  })

  it('player can not update an event', async () => {
    const docRef = doc(player, 'events/1')
    const data = { name: 'test' }
    await assertFails(updateDoc(docRef, data))
  })

  it('player can not delete event', async () => {
    const docRef = doc(player, 'events/1')
    await assertFails(deleteDoc(docRef))
  })

  it('player can not create a new event', async () => {
    const docRef = doc(player, 'events/2')
    const data = { name: 'test' }
    await assertFails(setDoc(docRef, data))
  })

  it('coach can read event', async () => {
    const docRef = doc(coach, 'events/1')
    await assertSucceeds(getDoc(docRef))
  })

  it('coach can read all events', async () => {
    const docRef = collection(coach, 'events')
    await assertSucceeds(getDocs(docRef))
  })

  it('coach can update an event', async () => {
    const docRef = doc(coach, 'events/1')
    const data = { name: 'test' }
    await assertSucceeds(updateDoc(docRef, data))
  })

  it('coach can delete event', async () => {
    const docRef = doc(coach, 'events/1')
    await assertSucceeds(deleteDoc(docRef))
  })

  it('coach can create a new event', async () => {
    const docRef = doc(coach, 'events/2')
    const data = { name: 'test' }
    await assertSucceeds(setDoc(docRef, data))
  })

  it('admin can read event', async () => {
    const docRef = doc(admin, 'events/1')
    await assertSucceeds(getDoc(docRef))
  })

  it('admin can read all events', async () => {
    const docRef = collection(admin, 'events')
    await assertSucceeds(getDocs(docRef))
  })

  it('admin can update an event', async () => {
    const docRef = doc(admin, 'events/1')
    const data = { name: 'test' }
    await assertSucceeds(updateDoc(docRef, data))
  })

  it('admin can delete event', async () => {
    const docRef = doc(admin, 'events/1')
    await assertSucceeds(deleteDoc(docRef))
  })

  it('admin can create a new event', async () => {
    const docRef = doc(admin, 'events/2')
    const data = { name: 'test' }
    await assertSucceeds(setDoc(docRef, data))
  })

  it('player can read own profile', async () => {
    const docRef = doc(player, 'users/1')
    await assertSucceeds(getDoc(docRef))
  })

  it('player can not read all profiles', async () => {
    const docRef = collection(player, 'users')
    await assertFails(getDocs(docRef))
  })

  it('player can update own profile', async () => {
    const docRef = doc(player, 'users/1')
    const data = { name: 'test' }
    await assertSucceeds(updateDoc(docRef, data))
  })

  it('player can not delete own profile', async () => {
    const docRef = doc(player, 'users/1')
    await assertFails(deleteDoc(docRef))
  })

  it('player can not create new profile', async () => {
    const docRef = doc(player, 'users/4')
    const data = { name: 'test', uid: 'player2' }
    await assertFails(setDoc(docRef, data))
  })

  it('coach can read own profile', async () => {
    const docRef = doc(coach, 'users/2')
    await assertSucceeds(getDoc(docRef))
  })

  it('coach can not read other profile', async () => {
    const docRef = doc(coach, 'users/1')
    await assertFails(getDoc(docRef))
  })

  it('coach can list other profiles', async () => {
    const docRef = collection(coach, 'users')
    await assertFails(getDocs(docRef))
  })

  it('coach can update own profile', async () => {
    const docRef = doc(coach, 'users/2')
    const data = { name: 'coach2' }
    await assertSucceeds(updateDoc(docRef, data))
  })

  it('coach can not delete own profile', async () => {
    const docRef = doc(coach, 'users/2')
    await assertFails(deleteDoc(docRef))
  })

  it('coach can create not create new profile', async () => {
    const docRef = doc(coach, 'users/4')
    const data = { name: 'test', uid: 'coach2' }
    await assertFails(setDoc(docRef, data))
  })

  it('admin can read own profile', async () => {
    const docRef = doc(admin, 'users/3')
    await assertSucceeds(getDoc(docRef))
  })

  it('admin can read other profile', async () => {
    const docRef = doc(admin, 'users/1')
    await assertSucceeds(getDoc(docRef))
  })

  it('admin can read all profiles', async () => {
    const docRef = collection(admin, 'users')
    await assertSucceeds(getDocs(docRef))
  })

  it('admin can update an profiles', async () => {
    const docRef = doc(admin, 'events/1')
    const data = { name: 'player1' }
    await assertSucceeds(updateDoc(docRef, data))
  })

  it('admin can delete own profile', async () => {
    const docRef = doc(admin, 'events/3')
    await assertSucceeds(deleteDoc(docRef))
  })

  it('admin can create a new profile', async () => {
    const docRef = doc(admin, 'users/3')
    const data = { name: 'test' }
    await assertSucceeds(setDoc(docRef, data))
  })

  afterAll(async () => {
    await testEnv.clearFirestore()
  })
})

/**
 * Admin ---- Sets the permissons ---> [UserSecurity]
 * User  ---- Reads the permissons ---> [UserSecurity]
 * Firebase Function ---- Writes From Database to Authenticaiton ----> [UserSecurity]
 */
