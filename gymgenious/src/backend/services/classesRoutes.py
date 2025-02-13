from firebase_config import db


def get_classes():
    try:
        classes_ref = db.collection('classes')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error while getting the classes: {e}")
        raise RuntimeError("It was not possible to get the classes")

def get_comments():
    try:
        classification_ref = db.collection('califications')
        docs = classification_ref.stream()
        classifications = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classifications
    except Exception as e:
        print(f"Error while getting the clasifications: {e}")
        raise RuntimeError("It was not possible to get the clasifications")

def create_class(new_class):
    try:
        db.collection('classes').add(new_class)
        created_class = {**new_class}
        return created_class
    except Exception as e:
        print(f"Error while creating the class: {e}")
        raise RuntimeError("It was not possible to create the class")

def add_assistance(class_assistance,fecha,uid):
    try:
        new_assist = {'date':fecha,'cid':class_assistance,'uid':uid}
        class_ref = db.collection('classAssistance').add(new_assist)
        created_class = {**new_assist}
        return created_class
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
    
def add_calification(classId, calification, commentary, userId):
    try:
        new_calification = {
            'cid': classId,
            'uid': userId,
            'calification': calification,
            'commentary': commentary
        }
        ref = db.collection('califications')
        docs = list(ref.where('uid', '==', userId).where('cid', '==', classId).stream())
        if docs:
            for doc in docs:
                ref.document(doc.id).update({
                    'calification': calification,
                    'commentary': commentary
                })
            return new_calification 
        else:
            ref.add(new_calification)
            return new_calification 
    except Exception as e:
        print(f"Error while creating the classification: {e}")
        raise RuntimeError("It was not possible to create the classification")

def book_class(event, mail,uid):
    try:
        print("id:",event)
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail not in booked_users:
            booked_users.append(mail)
        doc_ref.update({
            'BookedUsers': booked_users
        })
        membership_user_ref = db.collection('membershipsUsers').where('userId', '==', uid)
        membership_user_docs = membership_user_ref.stream()

        membership_id = None
        for doc in membership_user_docs:
            membership_id = doc.to_dict().get('membershipId')
            break 
        if not membership_id:
            print("No se encontró ninguna membresía para este usuario.")
            return None
        memberships_ref = db.collection('memberships')
        doc_ref = memberships_ref.document(membership_id)
        doc = doc_ref.get()
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('BookedClasses', [])
            if event not in booked_users:
                booked_users.append(event)
            doc_ref.update({
                'BookedClasses': booked_users
            })
        else:
            print("No se encontró la membresía correspondiente.")
            return None
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while booking the class: {e}")
        raise RuntimeError("It was not possible to book the class")

def book_class_with_gem(event, mail,membId):
    try:
        print("id:",event)
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail not in booked_users:
            booked_users.append(mail)
        doc_ref.update({
            'BookedUsers': booked_users
        })
        memberships_ref = db.collection('memberships')
        doc_ref = memberships_ref.document(membId)
        doc = doc_ref.get()
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('BookedClasses', [])
            if event not in booked_users:
                booked_users.append(event)
            doc_ref.update({
                'BookedClasses': booked_users
            })
        users_ref = db.collection('users')
        docs = users_ref.where('Mail', '==', mail).stream()
        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc = doc_ref.get()
            gems_amount = doc.to_dict().get('Gemas',' ')
            doc_ref.update({
                'Gemas': gems_amount-1
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while booking the class: {e}")
        raise RuntimeError("It was not possible to book the class")
    
def unbook_class(event, mail,uid):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        current_data = doc.to_dict()
        booked_users = current_data.get('BookedUsers', [])
        if mail in booked_users:
            booked_users.remove(mail)
            doc_ref.update({
                'BookedUsers': booked_users
            })
        
        membership_user_ref = db.collection('membershipsUsers').where('userId', '==', uid)
        membership_user_docs = membership_user_ref.stream()

        membership_id = None
        for doc in membership_user_docs:
            membership_id = doc.to_dict().get('membershipId')
            break 
        if not membership_id:
            print("No se encontró ninguna membresía para este usuario.")
            return None
        membership_ref = db.collection('memberships')
        doc_ref = membership_ref.document(membership_id)
        doc = doc_ref.get()
        if doc.exists: 
            current_data = doc.to_dict()
            booked_users = current_data.get('BookedClasses', [])
            if event in booked_users:
                booked_users.remove(event)
                doc_ref.update({
                    'BookedClasses': booked_users
                })
        else:
            print("No se encontró la membresía correspondiente.")
            return None
        
    except Exception as e:
        print(f"Error while unbooking the class: {e}")
        raise RuntimeError("It was not possible to unbook the class")

def delete_class(event,mail):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(event)
        doc = doc_ref.get()
        doc.reference.delete()
    except Exception as e:
        print(f"Error while deleting the class: {e}")
        raise RuntimeError("It was not possible to delete the class")
    
def update_class_info(newClass):
    try:
        classes_ref = db.collection('classes')
        doc_ref = classes_ref.document(newClass['cid'])
        doc = doc_ref.get()
        if doc.exists: 
            doc_ref.update({
                'dateFin': newClass['DateFin'],
                'dateInicio': newClass['DateInicio'],
                'day': newClass['Day'],
                'hour':newClass['Hour'],
                'name': newClass['Name'],
                'permanent': newClass['Permanent'],
                'sala': newClass['sala'],
                'capacity' : int(newClass['capacity']),
            })
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error while updating the class: {e}")
        raise RuntimeError("It was not possible to update the class")
