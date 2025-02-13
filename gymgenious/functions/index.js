const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

const serviceAccount = require("./service_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pid-e18e4.firebaseapp.com",
});

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "isoldi772@gmail.com",
    pass: "pfwo xlvs tvpn mtmu",
  },
});

exports.scheduledFunction = functions.pubsub
    .schedule("every 480 minutes")
    .onRun(async (context) => {
      console.log("Ejecutando función programada...");

      const now = new Date();
      const oneDayLater = new Date();
      oneDayLater.setDate(now.getDate() + 1);

      try {
        const snapshot = await db.collection("classes").get();

        snapshot.forEach(async (doc) => {
          const data = doc.data();
          const classDate = new Date(data.dateInicio);

          if (classDate.toDateString() === oneDayLater.toDateString()) {
            console.log(`Enviando correos para la clase ${doc.id}...`);

            const emails = data.BookedUsers || [];

            for (const email of emails) {
              const mailOptions = {
                from: "isoldi772@gmail.com",
                to: email,
                subject: "Class reminder",
                text: `It's almost time for your class:\n
                ${data.name} ${classDate.toLocaleString()}`,
              };

              try {
                await transporter.sendMail(mailOptions);
                console.log(`Correo enviado a: ${email}`);
              } catch (error) {
                console.error(`Error enviando correo a ${email}:`, error);
              }
            }
          }
        });

        console.log("Proceso finalizado.");
      } catch (error) {
        console.error("Error obteniendo datos de Firestore:", error);
      }

      return null;
    });

exports.notifyProfessorOnCancellation = functions.firestore
    .document("classes/{classId}")
    .onUpdate(async (change, context) => {
      const before = change.before.data();
      const after = change.after.data();

      const beforeUsers = before.BookedUsers || [];
      const afterUsers = after.BookedUsers || [];
      const cancelledUsers = beforeUsers
          .filter((user) => !afterUsers.includes(user));

      if (cancelledUsers.length > 0) {
        const professorEmail = before.owner;

        if (!professorEmail) {
          console.error(`No se encontró el correo
               del profesor para la clase ${context.params.classId}`);
          return null;
        }

        console.log(`Notificando al profesor ${professorEmail}
           sobre cancelaciones en la clase ${context.params.classId}`);

        const mailOptions = {
          from: "isoldi772@gmail.com",
          to: professorEmail,
          subject: "A client unsubscribed from your class ",
          text: `${cancelledUsers.length} client(s) unsuscribed from your class:
          \n${before.name} dated ${new Date(before.dateInicio)
    .toLocaleString()}.\n\nUnsuscribed users:\n
                ${cancelledUsers.join(", ")}`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Correo enviado al profesor: ${professorEmail}`);
        } catch (error) {
          console.error(`Error enviando correo
             al profesor ${professorEmail}:`, error);
        }
      }

      return null;
    });

exports.notifyExpiringMemberships = functions.pubsub
    .schedule("every 480 minutes")
    .onRun(async (context) => {
      console.log("Ejecutando función para verificar membresías expirando...");

      const now = new Date();
      const oneDayLater = new Date();
      oneDayLater.setDate(now.getDate() + 1);

      try {
        const snapshot = await db.collection("membershipsUsers").get();

        for (const doc of snapshot.docs) {
          const data = doc.data();
          const expDate = new Date(data.exp);

          if (expDate.toDateString() === oneDayLater.toDateString()) {
            console.log(`La membresía de ${data.userId} expira pronto.`);

            const usersRef = db.collection("users");
            const querySnapshot = await
            usersRef.where("uid", "==", data.userId).limit(1).get();
            const userDoc = querySnapshot.docs[0];

            if (!userDoc.exists) {
              console.error(`Usuario ${data.userId} no
                       encontrado en la colección "users".`);
              continue;
            }

            const userEmail = userDoc.data().Mail;
            console.log(`Correo del usuario: ${userEmail}`);

            if (!userEmail) {
              console.error(`El usuario ${data.userId} 
                no tiene un correo registrado.`);
              continue;
            }

            const mailOptions = {
              from: "isoldi772@gmail.com",
              to: userEmail,
              subject: "Your membership is about to expire",
              text: `Hi, your membership in Gymgenious is about to expire\n
              Expiration day: ${expDate.toLocaleString()}.\n
              Renew in time to continue enjoying the benefits.`,
            };

            try {
              await transporter.sendMail(mailOptions);
              console.log(`Correo enviado a: ${userEmail}`);
            } catch (error) {
              console.error(`Error enviando correo a ${userEmail}:`, error);
            }
          }
        }

        console.log("Verificación de membresías completada.");
      } catch (error) {
        console.error("Error al obtener datos de Firestore:", error);
      }

      return null;
    });

exports.notifyClassFull = functions.firestore
    .document("classes/{classId}")
    .onUpdate(async (change, context) => {
      const before = change.before.data();
      const after = change.after.data();

      const capacity = after.capacity || 0;
      const bookedUsers = after.BookedUsers || [];
      const professorEmail = after.owner;

      if (before.BookedUsers?.length === capacity) {
        console.log(`La clase ${context.params.classId} 
          ya estaba llena antes. No se enviará otro correo.`);
        return null;
      }

      if (bookedUsers.length === capacity) {
        if (!professorEmail) {
          console.error(`No se encontró el correo del 
              profesor para la clase ${context.params.classId}`);
          return null;
        }

        console.log(`Notificando al profesor ${professorEmail} 
          que la clase ${context.params.classId} está llena.`);

        const mailOptions = {
          from: "isoldi772@gmail.com",
          to: professorEmail,
          subject: "Your class is full!",
          text: `Congratulations! Your class scheduled for:\n
          ${new Date(after.dateInicio).toLocaleString()}\n
          has reached its maximum capacity: ${capacity} clients.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Correo enviado al profesor: ${professorEmail}`);
        } catch (error) {
          console.error(`Error enviando correo 
              al profesor ${professorEmail}:`, error);
        }
      }

      return null;
    });
