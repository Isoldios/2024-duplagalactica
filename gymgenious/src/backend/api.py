from flask import Flask, request, jsonify
from flask_cors import CORS
from Controllers.classesController import add_calification_route,add_assistance_route,get_comments_route,get_classes_route, create_class_route,book_class_route,book_class_with_gem_route,unbook_class_route,delete_class_route,update_class_info_route
from Controllers.usersController import leave_ranking_route,join_ranking_route,get_rankings_route,create_ranking_route,use_geme_route,get_unique_user_by_email_route ,get_user_route, send_email_route, create_user_route,get_users_route,get_coach_users_route,get_clients_users_route,get_client_users_no_match_routine_route,update_users_info_route
from Controllers.excersicesController import create_exersice_route,get_excersice_by_owner_route,get_excersices_route,update_exer_info_route
from Controllers.routineController import create_routine_route,assign_routine_to_user_route,get_routines_route,get_assigned_routines_route,update_routine_info_route,delete_routine_route
from Controllers.salasController import get_salas_route
from Controllers.missionsController import add_mission_progress_route,add_missions_route,delete_missions_route,get_missions_progress_route,get_missions_template_route,assign_mission_route
from Controllers.membershipController import edit_memb_price_route,get_membership_template_route,get_unique_user_membership_route,update_class_use_route,use_membership_class_route,get_memb_user_route,unuse_membership_class_route,aquire_membership_month_route
from Controllers.attendanceController import mark_attendance_route,get_coach_clients_assistance_route
import jwt
import json
import datetime


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})



SECRET_KEY = 'mi_clave_secreta'

@app.route('/', methods=['GET'])
def default_route():
    return jsonify({'status': 'OK'})

# Users functions -------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_user', methods=['GET'])
def get_user():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        password = request.args.get('password')
        mail = request.args.get('mail')
        return get_user_route(password,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
        
@app.route('/get_rankings', methods=['GET'])
def get_rankings():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_rankings_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_users', methods=['GET'])
def get_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_client_users', methods=['GET'])
def get_client_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_clients_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
       
@app.route('/get_coach_users', methods=['GET'])
def get_coach_users():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_coach_users_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_client_users_no_match_routine', methods=['GET'])
def get_client_users_no_match_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        routine = request.args.get('routine')
        return get_client_users_no_match_routine_route(routine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_unique_user_by_email', methods=['GET'])
def get_unique_user_by_email():
    try:
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        username = request.args.get('mail')
        return get_unique_user_by_email_route(username)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})


#------------------------------------------------
#------------------------------------------------

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/use_geme', methods=['PUT'])
def use_geme():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        mail = request.json.get('mail')
        return use_geme_route(mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
   
@app.route('/join_ranking', methods=['PUT'])
def join_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        rankingID = request.json.get('id')
        userMail = request.json.get('user')
        return join_ranking_route(rankingID,userMail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/leave_ranking', methods=['PUT'])
def leave_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        rankingID = request.json.get('id')
        userMail = request.json.get('user')
        return leave_ranking_route(rankingID,userMail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/update_users_info', methods=['PUT'])
def update_users_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newUserInfo = request.json.get('newUser')
        return update_users_info_route(newUserInfo)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
   
#------------------------------------------------
#------------------------------------------------

# POST -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_user', methods=['POST'])
def create_user():
    user = request.json
    return create_user_route(user)

@app.route('/send_email', methods=['POST'])
def send_email():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        to_email = request.json.get('toEmail')
        return send_email_route(to_email)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/create_ranking', methods=['POST'])
def create_ranking():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRanking = request.json
        return create_ranking_route(newRanking)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Salas functions -------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_salas', methods=['GET'])
def get_salas():
    return get_salas_route()

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Missions functions ----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_missions_progress', methods=['GET'])
def get_missions_progress():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_missions_progress_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_missions_template', methods=['GET'])
def get_missions_template():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_missions_template_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/delete_missions', methods=['DELETE'])
def delete_missions():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        missions = request.form.get('misiones')
        
        return delete_missions_route(missions)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/add_assistance', methods=['PUT'])
def add_assistance():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        IdClase = request.form.get('IdClase')
        usuarios = request.form.get('usuarios')
        Inicio = request.form.get('Inicio')
        return add_assistance_route(IdClase,Inicio,usuarios)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/assign_mission', methods=['POST'])
def assign_mission():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        amount = request.form.get('cant')
        userId = request.form.get('uid')
        return assign_mission_route(amount,userId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/add_missions', methods=['POST'])
def add_missions():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        users = request.form.get('usuarios')
        event = request.form.get('selectedEvent')
        return add_missions_route(users,event)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# DELETE  ---------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/add_mission_progress', methods=['DELETE'])
def add_mission_progress():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        missions = request.form.get('misiones')
        uid = request.form.get('uid')
        return add_mission_progress_route(missions,uid)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------


# Membership functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_memb_user', methods=['GET'])
def get_memb_user():
    return get_memb_user_route()

@app.route('/get_memberships', methods=['GET'])
def get_unique_user_membership():
    return get_unique_user_membership_route()

@app.route('/get_membership_template', methods=['GET'])
def get_membership_template():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_membership_template_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------ 

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------
    
@app.route('/aquire_membership_month', methods=['PUT'])
def aquire_membership_month():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        startDate = request.json.get('inicio')
        uid = request.json.get('userId')
        endDate = request.json.get('fin')
        type_memb = request.json.get('type_memb')
        return aquire_membership_month_route(startDate,uid,endDate,type_memb)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
@app.route('/unuse_membership_class', methods=['PUT'])
def unuse_membership_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('id')
        membId = request.json.get('membId')
        return unuse_membership_class_route(classId,membId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/update_class_use', methods=['PUT'])
def update_class_use():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        users = request.form.get('usuarios')
        event = request.form.get('selectedEvent')
        return update_class_use_route(users,event)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/edit_memb_price', methods=['PUT'])
def edit_memb_price():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        type_user = request.json.get('tipo')
        price = request.json.get('precio')
        return edit_memb_price_route(type_user,price)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/use_membership_class', methods=['PUT'])
def use_membership_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('id')
        membId = request.json.get('membId')
        return use_membership_class_route(classId,membId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------ 

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# Attendance functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_coach_clients_assistance', methods=['GET'])
def get_coach_clients_assistance():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_coach_clients_assistance_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/mark-attendance', methods=['POST'])
def mark_attendance():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        uid = request.form.get('uid')
        timestamp = request.form.get('timestamp')
        return mark_attendance_route(uid,timestamp)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong: {}'.format(e)})
    
#------------------------------------------------
#------------------------------------------------

# Classes functions -----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------
@app.route('/get_classes', methods=['GET'])
def get_classes():
    return get_classes_route()

@app.route('/get_comments', methods=['GET'])
def get_comments():
    return get_comments_route()

#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_class', methods=['POST'])
def create_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        new_class = request.json
        return create_class_route(new_class)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    

#------------------------------------------------
#------------------------------------------------


# PUT  ------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/update_class_info', methods=['PUT'])
def update_class_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        cid = request.form.get('cid')
        name = request.form.get('Name')
        DateFin = request.form.get('DateFin')
        DateInicio = request.form.get('DateInicio')  
        Day = request.form.get('Day')       
        Hour = request.form.get('Hour')
        permanent = request.form.get('Permanent')
        place = request.form.get('sala')
        capacity = request.form.get('capacity')
        newClassInfo = {
            'cid' : cid,
            'DateFin': DateFin,
            'DateInicio': DateInicio,
            'Day':Day,
            'Name': name,
            'Hour':Hour,
            'Permanent':permanent,
            'sala':place,
            'capacity':capacity,
        }
        return update_class_info_route(newClassInfo)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/unbook_class', methods=['PUT'])
def unbook_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        uid = request.json.get('uid')
        return unbook_class_route(event,mail,uid)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/book_class', methods=['PUT'])
def book_class():
    try:
        token = request.headers.get('Authorization')
        event = request.json.get('event')
        mail = request.json.get('mail')
        uid = request.json.get('uid')
        verification_token(token,mail,uid)
        return book_class_route(event, mail, uid)
    except Exception as e:
        print('error', e)
        return jsonify({'error': 'Something went wrong'})
    
def verification_token(token,mail,uid):
    if 'Bearer' not in token:
        raise ValueError("Missing Token")
    token_without_bearer = token.split(" ")[1]
    token_value = jwt.decode(token_without_bearer, options={"verify_signature": False})
    tokenUid = token_value['user_id']
    tokenMail = token_value['email']
    if (tokenUid!=uid or mail!=tokenMail):
        raise ValueError("User Unauthorized")

    
@app.route('/book_class_with_gem', methods=['PUT'])
def book_class_with_gem():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        print("a")
        event = request.json.get('event')
        mail = request.json.get('mail')
        membId = request.json.get('membId')
        print("n")
        return book_class_with_gem_route(event,mail,membId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    

@app.route('/add_calification', methods=['PUT'])
def add_calification():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        classId = request.json.get('event')
        calification = request.json.get('calification')
        commentary = request.json.get('commentary')        
        userId = request.json.get('user')
        return add_calification_route(classId,calification,commentary,userId)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
#------------------------------------------------
#------------------------------------------------

# DELETE ----------------------------------------
#------------------------------------------------
#------------------------------------------------
@app.route('/delete_class', methods=['DELETE'])
def delete_class():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        mail = request.json.get('mail')
        return delete_class_route(event,mail)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
#------------------------------------------------
#------------------------------------------------

    

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------



# Excersices functions --------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_excersice_by_owner', methods=['GET'])
def get_excersice_by_owner():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        owner = request.args.get('owner')
        return get_excersice_by_owner_route(owner)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_excersices', methods=['GET'])
def get_excersices():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_excersices_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------
 
# PUT  ------------------------------------------
#------------------------------------------------
#------------------------------------------------
  
@app.route('/update_exer_info', methods=['PUT'])
def update_exer_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        description = request.form.get('description')
        image_url = request.form.get('image_url')        
        image = request.files.get('image')
        image_data = None
        if image:
            image_data = image.read()  
        id = request.form.get('id')
        newExersice = {
            'id' : id,
            'name': name,
            'description': description,
            'image_url': image_url,
            'image': image_data 
        }
        return update_exer_info_route(newExersice)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})
    
#------------------------------------------------
#------------------------------------------------

# POST  -----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_exersice', methods=['POST'])
def create_exersice():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        name = request.form.get('name')
        description = request.form.get('description')
        owner = request.form.get('owner')        
        image = request.files.get('image')
        image_data = None
        if image:
            image_data = image.read()  

        newExersice = {
            'name': name,
            'description': description,
            'owner': owner,
            'image': image_data 
        }
        return create_exersice_route(newExersice)
    except Exception as e:
        print("Error a")
        return jsonify({'error':'Something went wrong'})
#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------



# Routine functions -----------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------

# GET -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/get_assigned_routines', methods=['GET'])
def get_assigned_routines():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_assigned_routines_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/get_routines', methods=['GET'])
def get_routines():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        return get_routines_route()
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# DELETE ----------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/delete_routine', methods=['DELETE'])
def delete_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        event = request.json.get('event')
        return delete_routine_route(event)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# POST ------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/create_routine', methods=['POST'])
def create_routine():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json
        return create_routine_route(newRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

# PUT -------------------------------------------
#------------------------------------------------
#------------------------------------------------

@app.route('/update_routine_info', methods=['PUT'])
def update_routine_info():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newRoutine = request.json.get('newRoutine')
        return update_routine_info_route(newRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

@app.route('/assign_routine_to_user', methods=['PUT'])
def assign_routine_to_user():
    try :
        token = request.headers.get('Authorization')
        if not token or 'Bearer' not in token:
            return jsonify({'error':'Missing token'})
        newAssignRoutine = request.json
        return assign_routine_to_user_route(newAssignRoutine)
    except Exception as e:
        print("Error")
        return jsonify({'error':'Something went wrong'})

#------------------------------------------------
#------------------------------------------------

#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------
#------------------------------------------------


























if __name__ == '__main__':
    app.run(debug=True)
