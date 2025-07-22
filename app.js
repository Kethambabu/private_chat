import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, serverTimestamp,
  query, orderBy, deleteDoc, doc, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAc-bbRwur69BIP_gjrUX52UZNxKG-51zo",
  authDomain: "privatechat-bcba3.firebaseapp.com",
  projectId: "privatechat-bcba3",
  storageBucket: "privatechat-bcba3.firebasestorage.app",
  messagingSenderId: "836428875821",
  appId: "1:836428875821:web:63f90df52d25638ca2d0a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");
const usersRef = collection(db, "chat_users");
let userDocId = null;

async function checkUserLimit() {
  const snapshot = await getDocs(usersRef);
  if (snapshot.size >= 2) {
    alert("Chat is full! Only 2 users allowed.");
    document.body.innerHTML = "<h2 style='text-align:center;'>Chat is full. Try again later.</h2>";
    return false;
  }
  const userDoc = await addDoc(usersRef, {
    joinedAt: serverTimestamp()
  });
  userDocId = userDoc.id;
  return true;
}

window.addEventListener("beforeunload", async () => {
  if (userDocId) {
    await deleteDoc(doc(db, "chat_users", userDocId));
  }
});

checkUserLimit().then((allowed) => {
  if (!allowed) return;

  const chatBox = document.getElementById("chat-box");
  const messageInput = document.getElementById("message-input");

  const q = query(messagesRef, orderBy("timestamp"));
  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const msg = document.createElement("div");
      msg.classList.add("chat-message");
      msg.innerHTML = \`
        <span>\${data.text}</span>
        <button class="del-btn" onclick="deleteMessage('\${docSnap.id}')">🗑️</button>
      \`;
      chatBox.appendChild(msg);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

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

  window.deleteMessage = async (id) => {
    await deleteDoc(doc(db, "messages", id));
  };

  window.clearChat = async () => {
    const allDocs = await getDocs(messagesRef);
    allDocs.forEach(async (d) => {
      await deleteDoc(doc(db, "messages", d.id));
    });
  };
});
