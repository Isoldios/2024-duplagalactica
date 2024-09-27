import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def get_classes():
    try:
        classes_ref = db.collection('classes')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")

def create_class(new_class):
    try:
        class_ref = db.collection('classes').add(new_class)
        created_class = {**new_class}
        return created_class
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")


def book_class(event, mail):
    try:
        print("id:",event)
        users_ref = db.collection('classes')
        doc_ref = users_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail not in booked_users:
            booked_users.append(mail)
        doc_ref.update({
            'BookedUsers': booked_users
        })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    
def unbook_class(event, mail):
    try:
        users_ref = db.collection('classes')
        doc_ref = users_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail in booked_users:
            booked_users.remove(mail)
            doc_ref.update({
                'BookedUsers': booked_users
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")

def delete_class(event,mail):
    try:
        users_ref = db.collection('classes')
        doc_ref = users_ref.document(event)
        doc = doc_ref.get()
        doc.reference.delete()
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    

def update_class_info(newClass):
    try:
        users_ref = db.collection('classes')
        doc_ref = users_ref.document(newClass['cid'])
        doc = doc_ref.get()
        if doc.exists: 
            doc_ref.update({
                'dateFin': newClass['DateFin'],
                'dateInicio': newClass['DateInicio'],
                'day': newClass['Day'],
                'hour':newClass['Hour'],
                'name': newClass['Name'],
                'permanent': newClass['Permanent']
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando la clase: {e}")
        raise RuntimeError("No se pudo actualizar la clase")
