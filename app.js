import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAc-bbRwur69BIP_gjrUX52UZNxKG-51zo",
  authDomain: "privatechat-bcba3.firebaseapp.com",
  projectId: "privatechat-bcba3",
  storageBucket: "privatechat-bcba3.appspot.com",
  messagingSenderId: "836428875821",
  appId: "1:836428875821:web:63f90df52d25638ca2d0a4",
  measurementId: "G-G0CCPH91RR"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");

// Prompt for username
const allowedUsers = ["balu", "user2"];
let currentUser = prompt("Enter your username:");

while (!allowedUsers.includes(currentUser)) {
  currentUser = prompt("Only specific users allowed. Re-enter username:");
}

const messagesRef = collection(db, "messages");

// Real-time message listener
const q = query(messagesRef, orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const msg = document.createElement("div");

    // Class for alignment
    const isCurrentUser = data.username === currentUser;
    msg.className = `message ${isCurrentUser ? "self" : "other"}`;
    msg.textContent = data.text;

    // Delete button for own messages
    if (isCurrentUser) {
      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑";
      delBtn.classList.add("delete-btn");
      delBtn.onclick = async () => {
        if (confirm("Delete this message?")) {
          await deleteDoc(doc(db, "messages", docSnap.id));
        }
      };
      msg.appendChild(delBtn);
    }

    chatBox.appendChild(msg);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Send message
sendBtn.onclick = async () => {
  const text = messageInput.value.trim();
  if (text) {
    await addDoc(messagesRef, {
      text,
      username: currentUser,
      timestamp: serverTimestamp()
    });
    messageInput.value = "";
  }
};

// Clear all messages
clearBtn.onclick = async () => {
  if (confirm("Clear all messages?")) {
    const allDocs = await getDocs(messagesRef);
    allDocs.forEach(async (docSnap) => {
      await deleteDoc(doc(db, "messages", docSnap.id));
    });
  }
};
