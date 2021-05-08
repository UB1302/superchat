import './App.css';
import { useRef, useState } from 'react';

import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyDaXjUHj-zFgtUd_W6GcjVtvUkJwfXKKhM",
    authDomain: "superchat-94cb6.firebaseapp.com",
    projectId: "superchat-94cb6",
    storageBucket: "superchat-94cb6.appspot.com",
    messagingSenderId: "479165069272",
    appId: "1:479165069272:web:8a696ae3f15af9abb6a4ad"
  });
} else {
  firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  function signInWithGoogle() {

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )

}
// eslint-disable-next-line
function SignOut() {

  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {

  const { dummy } = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {

    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue('');

    // dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='Submit' disabled={!formValue}>🕊️</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  // eslint-disable-next-line
  const { text, uid, photoURL } = props.message;
  const messageClass = (uid === auth.currentUser.uid) ? 'sent' : 'Received';
  return (

    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt="user dp" />
      <p> {text}</p>
    </div>
  )
}

export default App;
