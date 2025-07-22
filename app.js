import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp,
  query, orderBy, deleteDoc, doc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ✅ Firebase Config
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
const messagesRef = collection(db, "messages");

// ✅ Get DOM elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");

// ✅ Real-time listener with sorting by timestamp
const q = query(messagesRef, orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const msg = document.createElement("div");
    msg.classList.add("chat-message");
    msg.innerHTML = `
      <span>${data.text}</span>
      <button class="del-btn" onclick="deleteMessage('${docSnap.id}')">🗑️</button>
    `;
    chatBox.appendChild(msg);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

// ✅ Send message
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

// ✅ Delete single message
window.deleteMessage = async (id) => {
  const docRef = doc(db, "messages", id);
  await deleteDoc(docRef);
};

// ✅ Clear all messages
window.clearChat = async () => {
  const allDocs = await getDocs(messagesRef);
  allDocs.forEach(async (d) => {
    await deleteDoc(doc(db, "messages", d.id));
  });
};
