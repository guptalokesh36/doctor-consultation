// Import the functions you need from the SDKs you need
import { Doctor } from '@/types';
import { initializeApp, getApp, FirebaseApp, getApps } from 'firebase/app';
import { getAuth, Auth, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { getFirestore, Firestore, getDoc, doc, setDoc, updateDoc, collection, getDocs, query, where, addDoc, Timestamp } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// Initialize Firebase
let firebaseApp: FirebaseApp;
try {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
} catch (error) {
    firebaseApp = initializeApp(firebaseConfig);
    console.log(error)
}


const auth: Auth = getAuth(firebaseApp);
const db: Firestore = getFirestore(firebaseApp);



const signup = async (name = "guest", email: string, password: string) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        setCookieSession(res);
        console.log(res);
        await setDoc(doc(db, "user", user.uid), {
            uid: user.uid,
            displayName: name,
            authProvider: "local",
            role: "user",
            email: user.email,
        });
        await updateProfile(user, { displayName: name });
    } catch (error) {
        console.log(error);
    }
};

const login = async (email: string, password: string) => {
    if (auth.currentUser) {
        console.log("Already logged in. Redirect or logout first.");
        return { success: false, error: "Already logged in." };
    }

    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setCookieSession(userCredential);
        const user = userCredential.user;
        const docRef = doc(db, 'user', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const userData = docSnap.data();
            const newUserRole = userData.role;
            console.log("in firebase", newUserRole);
        } else {
            console.log("User not found");
        }
    } catch (error) {
        console.log(error);
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        await fetch("/api/logout", {
            method: "POST",
        });

    } catch (error) {
        console.log(error);
        alert(error);
    }
};

const changeUserRole = async (uid: string, newRole: string) => {
    try {
        const userRef = doc(db, "user", uid);
        await updateDoc(userRef, {
            role: newRole,
        });
        console.log(`User role updated to: ${newRole}`);
    } catch (error) {
        console.error("Error updating user role:", error);
    }
};

const getAllUsers = async () => {
    try {
        const usersCollection = collection(db, "user");
        const querySnapshot = await getDocs(usersCollection);

        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: data.uid,
                email: data.email,
                displayName: data.displayName || "Unnamed",
                role: data.role || "unknown"
            };
        });

        console.log("Users:", users);
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

const getUsersByRole = async (role: string) => {
    try {
        const usersCollection = collection(db, "user");
        const q = query(usersCollection, where("role", "==", role));
        const querySnapshot = await getDocs(q);

        const users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                uid: data.uid,
                email: data.email,
                displayName: data.displayName || "Unnamed",
                role: data.role
            };
        });

        console.log(`Users with role "${role}":`, users);
        return users;
    } catch (error) {
        console.error(`Error fetching users with role "${role}":`, error);
        return [];
    }
};

// Wrapper for doctors
const getDoctors = async () => {
    return await getUsersByRole("doctor");
};

// Wrapper for regular users
const getRegularUsers = async () => {
    return await getUsersByRole("user");
};

const getCurrentUserRole = async (): Promise<string> => {
    const user = auth.currentUser;
    if (!user) return "guest";

    const docRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? docSnap.data().role : "user";
};

async function getDoctorById(uid: string): Promise<Doctor | null> {
    const ref = doc(db, "user", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
  
    const data = snap.data();
  
    return {
      uid: snap.id,
      displayName: data.displayName,
      email: data.email,
      role: data.role,
      bio: data.bio || "",
      specialization: data.specialization || "",
      availability: data.availability || [],
    };
  }


async function setCookieSession(result: UserCredential) {
    const token = await result.user.getIdToken(); // get Firebase JWT

    // Store it in a cookie
    await fetch("/api/session", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });
}

 async function bookAppointment(
    doctorId: string,
    patientId: string,
    date: string,
    time: string
  ) {
    const ref = collection(db, "bookings");
    await addDoc(ref, {
      doctorId,
      patientId,
      date,
      time,
      status: "confirmed",
      createdAt: Timestamp.now(),
    });
  }

export {
    auth, db, signup, login, logout, changeUserRole, getAllUsers,
    getDoctors, getRegularUsers, getCurrentUserRole, getDoctorById,
    bookAppointment
};