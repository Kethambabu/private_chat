import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAc-bbRwur69BIP_gjrUX52UZNxKG-51zo",
  authDomain: "privatechat-bcba3.firebaseapp.com",
  projectId: "privatechat-bcba3",
  storageBucket: "privatechat-bcba3.firebasestorage.app",
  messagingSenderId: "836428875821",
  appId: "1:836428875821:web:63f90df52d25638ca2d0a4",
  measurementId: "G-G0CCPH91RR"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Get DOM elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");

// ✅ Chat collection reference
const messagesRef = collection(db, "messages");

// ✅ Real-time listener
onSnapshot(messagesRef, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const msg = document.createElement("p");
    msg.textContent = data.text;
    chatBox.appendChild(msg);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// ✅ Expose sendMessage to HTML
window.sendMessage = async () => {
  const text = messageInput.value.trim();
  if (text !== "") {
    await addDoc(messagesRef, {
      text,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  }
};
